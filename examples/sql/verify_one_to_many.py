"""Run the SQL one-to-many example and assert the expected totals."""

import sqlite3


SCHEMA_AND_DATA = """
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
"""


def scalar(connection: sqlite3.Connection, query: str) -> float:
    return float(connection.execute(query).fetchone()[0])


def main() -> None:
    with sqlite3.connect(":memory:") as connection:
        connection.executescript(SCHEMA_AND_DATA)
        naive = scalar(
            connection,
            """
            SELECT SUM(o.amount)
            FROM orders AS o
            JOIN order_items AS oi ON oi.order_id = o.order_id
            WHERE o.status = 'paid'
            """,
        )
        order_total = scalar(
            connection,
            "SELECT SUM(amount) FROM orders WHERE status = 'paid'",
        )
        item_total = scalar(
            connection,
            """
            SELECT SUM(oi.quantity * oi.unit_price)
            FROM order_items AS oi
            JOIN orders AS o ON o.order_id = oi.order_id
            WHERE o.status = 'paid'
            """,
        )
        assert naive == 400.0, naive
        assert order_total == 300.0, order_total
        assert item_total == 300.0, item_total
        print(
            "SQLite example passed: "
            f"naive={naive:.0f}, order_total={order_total:.0f}, item_total={item_total:.0f}"
        )


if __name__ == "__main__":
    main()
