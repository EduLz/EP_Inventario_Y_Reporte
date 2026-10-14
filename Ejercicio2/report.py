import sqlite3


# Funcion para inicializar la base de datos y crear las tablas y valores asignados--------------------------
def inicializar_db(conexion):
    cursor = conexion.cursor()
    
    # estructura de la tabla 
    cursor.execute("""
                   CREATE TABLE IF NOT EXISTS sales (
                       id INTEGER PRIMARY KEY,
                       product VARCHAR(100),
                       quantity INTEGER,
                       unit_price DECIMAL(10, 2),
                       sale_date DATE
                    );   
                   """)
    
    
    # validación de registros existentes -----------------------------------------------------------
    cursor.execute("SELECT COUNT(*) FROM sales;")
    total_registros = cursor.fetchone()[0]

    # tabla vacia, insertar registros de ejemplo
    if total_registros == 0:
        datos_prueba = [
            (1, 'Teclado', 2, 150.00, '2026-10-01'),
            (2, 'Mouse', 3, 85.00, '2026-10-01'),
            (3, 'Monitor', 1, 1200.00, '2026-10-02'),
            (4, 'Teclado', 1, 150.00, '2026-10-02'),
            (5, 'Mouse', 5, 85.00, '2026-10-03'),
            (6, 'Monitor', 2, 1200.00, '2026-10-03'),
            (7, 'Teclado', 4, 150.00, '2026-10-04'),
            (8, 'Mouse', 2, 85.00, '2026-10-04'),
        ]
        cursor.executemany("INSERT INTO sales VALUES (?, ?, ?, ?, ?);", datos_prueba) # comando para insertar los registros de prueba en la tabla
        conexion.commit() # guardar los cambios en la base de datos
        
# Funcion para generar el reporte de ventas ----------------------------------------------------------
def generar_reporte():
    conexion = sqlite3.connect('sales.db')  # conexión a la base de datos
    inicializar_db(conexion)  # inicializar la db (segun instrucciones iniciales)
    
    cursor = conexion.cursor()
    
    # consulta para obtener los datos de ventas agrupados por producto y fecha--------------------------------------------------------
    cursor.execute ("SELECT id, product, quantity, unit_price, sale_date FROM sales;")
    ventas = cursor.fetchall()  # obtener todos los registros de la consulta
    
    conexion.close()
    
    
    # variables para almacenar resultados del reporte --------------------------------------------------------
    ventas_por_producto = {} # diccionario para almacenar las ventas por producto
    total_general_ventas = 0.0 
    total_unidades_vendidas = 0
    
    
    # metodo para recorrer los registros nativamente -------------------------------------------------------
    for fila in ventas:
        id_venta, producto, cantidad, precio_unitario, fecha = fila 
        
        subtotal_venta = cantidad * precio_unitario # subtotal de la venta
        
        #acumular totales
        total_general_ventas += subtotal_venta 
        total_unidades_vendidas += cantidad 
        
        # agrupar en el diccionario por producto
        if producto not in ventas_por_producto: # si el producto no existe en el diccionario, inicializarlo
            ventas_por_producto[producto] = { # crear un diccionario para almacenar las métricas del producto
                "unidades": 0,
                "total_dinero": 0.0
            }
            
        # acumular las métricas del producto    
        ventas_por_producto[producto]["unidades"] += cantidad 
        ventas_por_producto[producto]["total_dinero"] += subtotal_venta
    
    # determinar el producto con mayor monto de ventas ---------------------------------------    
    producto_estrella = ""
    mayor_monto = -1.0
    
    for producto, metricas in ventas_por_producto.items(): # recorrer el diccionario de ventas por producto
        if metricas["total_dinero"] > mayor_monto: # comparar el total de dinero de cada producto con el mayor monto registrado
            mayor_monto = metricas["total_dinero"] # actualizar el mayor monto
            producto_estrella = producto # actualizar el producto estrella
    
    # generar el reporte-------------------------------------------------------------------------
    print("========================= REPORTE DE VENTAS =============================")
    print(f"{'Producto':<20} | {'Unidades Vendidas':>12} | {'Total Ventas (Q)':>18}")
    print("---------------------+-------------------+-------------------------------")
    
    for producto , metricas in ventas_por_producto.items(): # recorrer el diccionario de ventas por producto para imprimir los resultados
        unidades = metricas["unidades"] 
        total = metricas["total_dinero"]
        print(f"{producto:<20} | {unidades:>17} | {total:>18.2f} |") # imprimir los datos de cada producto
        
    print("---------------------+-------------------+-------------------------------")
    print("RESUMEN GENERAL:")
    print(f"  -Total de ventas: Q{total_general_ventas:.2f}")
    print(f"  -Total de unidades vendidas: {total_unidades_vendidas}")
    print(f"  -Producto estrella: {producto_estrella} (Q{mayor_monto:.2f})")
    
if __name__ == "__main__": 
    generar_reporte()

    
    
    
    
    