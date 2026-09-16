---
title: Spark 慢作业诊断实验（计划）
description: 一份尚未完成的 Spark 性能诊断实验设计：先建基线，再用 UI 和数据分布验证假设。
---

# Spark 慢作业诊断实验

> **实验状态：计划中，尚未完成。**下面是准备执行的方案，不是已经测得的结果，也不代表生产集群的性能结论。

## 要回答的问题

准备一个“订单与客户关联后按地区聚合”的批处理任务，先建立正常运行基线，再分别制造三种变化：

- 数据倾斜：少数客户拥有异常多的记录；
- 小文件过多：同一数据被拆成大量小文件；
- 分区过少：让少数 Task 承担过多数据。

每次只改变一个条件，比较运行指标和结果。

## 基线记录

| 项目 | 记录内容 |
| --- | --- |
| 数据 | 行数、文件数、格式、关键字段分布 |
| 环境 | Spark/Python 版本、本地资源 |
| 运行 | 总耗时、Stage/Task 数量、重试情况 |
| 结果 | 输出行数、金额或计数、质量检查 |

没有基线，就无法判断“优化”改变了什么。Spark 采用惰性执行，应测量真正触发计算的 action，而不是只测量构建 DataFrame 的时间。

## 诊断顺序

```text
是哪一次查询慢？ → 哪一个 Stage 慢？ → 所有 Task 都慢，还是少数 Task 异常？
```

随后查看输入量、Shuffle 读写、磁盘溢写、任务重试和 GC 等指标。少数 Task 明显更慢且处理的数据更多时，才有理由怀疑倾斜；“只剩一个任务”本身不是充分证据。

## 待验证的假设

### A：Join 键分布倾斜

先统计热点键：

```sql
SELECT customer_id, COUNT(*) AS row_count
FROM orders
GROUP BY customer_id
ORDER BY row_count DESC;
```

将分布与 Spark UI 的 Task 输入量和耗时对照。确认原因后，再评估广播 Join、AQE 倾斜处理或热点数据单独处理；方案的适用条件要随结果记录。

### B/C：小文件与分区数

用相同数据生成“文件数量不同”的两组输入，再对比扫描 Task 和调度开销；在同一输入下对比合理分区数与极少分区数，观察长尾 Task。每次改动都要同时核对输出。

## 计划中的代码入口

```python
from pyspark.sql import SparkSession, functions as F

spark = SparkSession.builder.appName("slow-job-lab").getOrCreate()
orders = spark.read.parquet("data/orders")
customers = spark.read.parquet("data/customers")
result = (
    orders.join(customers, on="customer_id", how="left")
    .groupBy("region")
    .agg(F.sum("amount").alias("total_amount"))
)
result.orderBy("region").write.mode("overwrite").parquet("output/by-region")
spark.stop()
```

这里的数据生成与参数仍是占位符。实验完成后，需要补齐数据规模、UI 证据、前后对比、结果一致性和不能外推到生产的限制，之后才会把“计划”改成复盘。

## 延伸阅读

- [Spark Web UI 官方文档](https://spark.apache.org/docs/latest/web-ui.html)
- [Spark SQL 性能调优官方文档](https://spark.apache.org/docs/latest/sql-performance-tuning.html)
- [学习路线](/roadmap)
