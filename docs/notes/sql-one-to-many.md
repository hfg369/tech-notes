---
title: SQL：一对多关联为何会重复计数
description: 用 SQLite 重现订单表与明细表 Join 后的金额翻倍问题，并用数据粒度修正它。
---

# SQL：一对多关联为何会重复计数

> 这是一篇可运行的入门笔记。示例只使用内存 SQLite，不代表任何真实业务数据。

很多“报表金额突然变大”的问题，不是 `SUM` 写错了，而是**聚合发生在错误的数据粒度上**。订单表通常是一行一个订单，订单明细表则是一行一个商品明细；直接关联后，一个订单可能变成多行。

## 先把粒度说清楚

动手写 SQL 前，先写一句“每一行代表什么”：

| 表 | 一行代表 | 适合直接统计的字段 |
| --- | --- | --- |
| `orders` | 一个订单 | 订单总额、订单状态 |
| `order_items` | 一个订单中的一条商品明细 | 数量、单价、明细金额 |

要计算“已支付订单总额”，应在订单粒度上汇总 `orders.amount`；要计算“已支付商品明细金额”，则在明细粒度上汇总 `quantity * unit_price`。

## 用小数据复现

下面的脚本可以直接复制到 SQLite 中执行，也可以运行仓库中的 `examples/sql/verify_one_to_many.py`。脚本会断言结果，避免只凭肉眼看输出。

```sql
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  ordered_at TEXT NOT NULL,
  status TEXT NOT NULL,
  amount REAL NOT NULL
);

CREATE TABLE order_items (
  item_id INTEGER PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL
);

INSERT INTO orders VALUES
  (1, '2026-08-01', 'paid', 100.0),
  (2, '2026-08-01', 'paid', 200.0),
  (3, '2026-08-02', 'refunded', 150.0);

INSERT INTO order_items VALUES
  (101, 1, 'Mouse', 2, 20.0),
  (102, 1, 'Keyboard', 1, 60.0),
  (103, 2, 'Monitor', 1, 200.0),
  (104, 3, 'Cable', 3, 10.0);
```

订单 1 有两条明细，所以 Join 后订单金额 `100` 出现两次：

```sql
SELECT o.order_id, o.amount, oi.product_name
FROM orders AS o
JOIN order_items AS oi ON oi.order_id = o.order_id
WHERE o.status = 'paid';
```

直接对订单字段求和会得到 400，而订单表中的已支付订单总额应为 300：

```sql
SELECT SUM(o.amount) AS wrong_order_total
FROM orders AS o
JOIN order_items AS oi ON oi.order_id = o.order_id
WHERE o.status = 'paid';
```

## 修正方式取决于指标

### 订单级指标：不要关联明细表

```sql
SELECT SUM(amount) AS paid_order_total
FROM orders
WHERE status = 'paid';
```

结果是 **300**。

### 明细级指标：汇总明细金额

```sql
SELECT SUM(oi.quantity * oi.unit_price) AS paid_item_total
FROM order_items AS oi
JOIN orders AS o ON o.order_id = oi.order_id
WHERE o.status = 'paid';
```

结果也是 **300**，因为这里汇总的是明细字段。

如果还需要同时展示订单字段，可以先把明细聚合回“一行一个订单”，再关联：

```sql
WITH item_totals AS (
  SELECT order_id, SUM(quantity * unit_price) AS item_total
  FROM order_items
  GROUP BY order_id
)
SELECT SUM(item_total) AS paid_item_total
FROM item_totals AS i
JOIN orders AS o ON o.order_id = i.order_id
WHERE o.status = 'paid';
```

## 为什么不随手写 `SUM(DISTINCT amount)`

`DISTINCT` 去掉的是相同数值，不是相同订单。如果两个订单恰好都为 100，`SUM(DISTINCT amount)` 会错误地只统计一次。去重依据应该是业务主键和目标粒度。

排查时可以先看每个订单关联出了几行：

```sql
SELECT o.order_id, o.amount, COUNT(oi.item_id) AS item_count
FROM orders AS o
LEFT JOIN order_items AS oi ON oi.order_id = o.order_id
GROUP BY o.order_id, o.amount
ORDER BY o.order_id;
```

看到 `item_count > 1`，就要警惕订单级字段在 Join 后被复制。

## 可复用的排查顺序

1. 写出每张表的一行粒度。
2. 记录指标定义：订单额、支付额、退款额还是净收入？
3. 比较 Join 前后的行数和主键重复情况。
4. 将订单级与明细级金额分开计算，用小样本回归。

取消、退款、拆单和订单更新的口径，需要由业务规则决定，SQL 不会自动替你决定。

## 延伸阅读

- [SQLite SELECT 文档](https://sqlite.org/lang_select.html)
- [学习路线](/roadmap)
