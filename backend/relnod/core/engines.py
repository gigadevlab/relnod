class BaseEngine:
    def __init__(self, dsn, table_name, keys):
        self.dsn = dsn
        self.table_name = table_name
        self.keys = keys

    # TODO: Apply change for all children
    def get_rows(self, *args, **kwargs):
        pass


class SQLiteEngine(BaseEngine):
    @staticmethod
    def dict_factory(cursor, row):
        col_names = [col[0] for col in cursor.description]
        return {key: value for key, value in zip(col_names, row)}

    def get_rows(self, *args, **kwargs):
        import sqlite3

        con = sqlite3.connect(self.dsn)
        con.row_factory = self.dict_factory
        keys = ','.join([f"\'{key}\'" for key in self.keys])

        cur = con.cursor()
        cur.execute(f"""
                SELECT key1, type1, relation_name, key2, type2 FROM \'{self.table_name}\'
                WHERE key1 in ({keys}) OR key2 in ({keys});
            """)
        rows = cur.fetchall()
        cur.close()
        return rows


class PostgresEngine(BaseEngine):
    def get_rows(self, *args, **kwargs):
        import psycopg

        con = psycopg.connect(**self.dsn, row_factory=psycopg.rows.dict_row)
        keys = ','.join([f"\'{key}\'" for key in self.keys])

        cur = con.cursor()
        cur.execute(f"""
                SELECT key1, type1, relation_name, key2, type2 FROM \"{self.table_name}\"
                WHERE key1 in ({keys}) OR key2 in ({keys});
            """)
        rows = cur.fetchall()
        cur.close()
        return rows


class PostgresInfoEngine(BaseEngine):
    def get_rows(self, *args, **kwargs):
        import psycopg

        con = psycopg.connect(**self.dsn, row_factory=psycopg.rows.dict_row)
        keys = ','.join([f"\'{key}\'" for key in self.keys])

        cur = con.cursor()
        cur.execute(f"""
                SELECT short_description, long_description FROM \"{self.table_name}\"
                WHERE key in ({keys});
            """)
        rows = cur.fetchall()
        cur.close()
        return rows
