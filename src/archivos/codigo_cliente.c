#include <stdio.h>
#include <stdlib.h>

#define TAM 5

// Códigos de colores ANSI para la consola
#define RESET   "\x1b[0m"
#define BOLD    "\x1b[1m"
#define RED     "\x1b[31m"
#define GREEN   "\x1b[32m"
#define YELLOW  "\x1b[33m"
#define BLUE    "\x1b[34m"
#define MAGENTA "\x1b[35m"
#define CYAN    "\x1b[36m"

void menu_banco();
void limpiarPantalla();
void imprimirTitulo();

// Ahora recibimos un puntero (*cuentas) en lugar de un arreglo
int buscarCuenta(int *cuentas, int tam, int nroBuscado);

// Creamos nuestras propias funciones con punteros para medir y comparar
int medirClave(char *cadena);
int compararClaves(char *cadena1, char *cadena2);

int main()
{
    int cuentas[TAM] = {1000, 1001, 1002, 1003, 1004};

    // PELIGRO 1 (Texto Plano): Usamos un array de punteros.
    // Apuntan directamente a la memoria donde están las claves expuestas sin encriptar.
    char *claves[TAM] = {"abc123", "xyz456", "pass01", "clave9", "seg789"};

    int nroCuenta;
    int opcion;
    int pos;
    char claveIngresada[7];

    // Creamos nuestro puntero que señala a donde vamos a guardar lo que tipea el usuario
    char *ptr_clave = claveIngresada;

    limpiarPantalla();
    imprimirTitulo();

    // PELIGRO 2 (Fuerza Bruta): No hay límite en el bucle, se puede intentar infinitas veces
    do
    {
        printf(BOLD CYAN "  ▶ " RESET "Ingrese su numero de cuenta: ");
        scanf("%d", &nroCuenta);

        // Al pasar 'cuentas' (el nombre del array), estamos pasando un puntero al primer elemento
        pos = buscarCuenta(cuentas, TAM, nroCuenta);

        if (pos == -1)
        {
            printf(RED "\n    ╭──────────────────────────────────────────────────╮\n");
            printf("    │ ✖ Error: cuenta no encontrada. Intente de nuevo. │\n");
            printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
        }

    } while (pos == -1);

    getchar(); // limpia el '\n' que dejó el scanf

    do
    {
        printf(BOLD CYAN "  ▶ " RESET "Ingrese su clave (6 caracteres): ");
        // PELIGRO 3: Le damos a gets() nuestro puntero.
        // gets() escribirá en esa dirección de memoria todo lo que teclee el usuario,
        // sin importar si se pasa de los 7 espacios y sobrescribe otros datos importantes.
        gets(ptr_clave);

        // Usamos nuestra función de punteros para medir
        if (medirClave(ptr_clave) != 6)
        {
            printf(YELLOW "\n    ╭──────────────────────────────────────────────────╮\n");
            printf("    │ ⚠ Error: la clave debe tener 6 caracteres.       │\n");
            printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
        }
        // Usamos nuestra función de punteros para comparar
        else if (compararClaves(ptr_clave, claves[pos]) != 0)
        {
            printf(RED "\n    ╭──────────────────────────────────────────────────╮\n");
            printf("    │ ✖ Error: clave incorrecta. Intente otra vez.     │\n");
            printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
        }

    } while (medirClave(ptr_clave) != 6 || compararClaves(ptr_clave, claves[pos]) != 0);

    // ── 3. Acceso concedido ──
    limpiarPantalla();
    printf(GREEN BOLD "\n    ✓ Acceso concedido.\n\n" RESET);
    printf(CYAN "    ========================================\n");
    printf(BOLD "          ¡BIENVENIDO A GLOBAL BANK!\n" RESET);
    printf(CYAN "    ========================================\n\n" RESET);

    menu_banco();
    printf(BOLD CYAN "  ▶ " RESET "Opcion: ");
    scanf("%d", &opcion);

    switch (opcion)
    {
        case 1: break;
        case 2: break;
        case 3: break;
        case 4: break;
        case 5: break;
        default:
            printf(GREEN "\n    ╭──────────────────────────────────────────────────╮\n");
            printf("    │ ✓ Hasta la próxima...                            │\n");
            printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
            break;
    }

    return 0;
}

void limpiarPantalla() {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void imprimirTitulo() {
    printf(CYAN BOLD);
    printf("\n");
    printf("     ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     \n");
    printf("    ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     \n");
    printf("    ██║  ███╗██║     ██║   ██║██████╔╝███████║██║     \n");
    printf("    ██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     \n");
    printf("    ╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗\n");
    printf("     ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝\n");
    printf("             B A N K I N G   S Y S T E M S            \n");
    printf(RESET "\n\n");
}

void menu_banco()
{
    printf(BOLD BLUE);
    printf("   ╭──────────────────────────────────────╮\n");
    printf("   │           MENÚ PRINCIPAL             │\n");
    printf("   ├──────────────────────────────────────┤\n");
    printf(RESET);
    printf("   │  " CYAN "1." RESET " Consultar saldo                  │\n");
    printf("   │  " CYAN "2." RESET " Retirar dinero                   │\n");
    printf("   │  " CYAN "3." RESET " Depositar dinero                 │\n");
    printf("   │  " CYAN "4." RESET " Transferir                       │\n");
    printf("   │  " CYAN "5." RESET " Ver recibo                       │\n");
    printf(BOLD BLUE "   ├──────────────────────────────────────┤\n");
    printf(RESET "   │  " RED "0." RESET " Salir                            │\n");
    printf(BOLD BLUE "   ╰──────────────────────────────────────╯\n" RESET);
    printf("\n");
}

int buscarCuenta(int *cuentas, int tam, int nroBuscado)
{
    for (int i = 0; i < tam; i++)
    {
        // En lugar de cuentas[i], usamos aritmetica de punteros.
        // *(cuentas + i) significa: "Ve al buzón de inicio, avanza 'i' pasos, y mira qué número hay adentro".
        if (*(cuentas + i) == nroBuscado)
            return i;
    }
    return -1;
}

int medirClave(char *cadena)
{
    int longitud = 0;

    while (*cadena != '\0')
    {
        longitud++; // Sumamos 1 a la cantidad de letras
        cadena++;   // Movemos el puntero al siguiente buzón (a la siguiente letra)
    }
    return longitud;
}

int compararClaves(char *cadena1, char *cadena2)
{
    // Comparamos letra por letra usando los punteros
    while (*cadena1 == *cadena2)
    {
        // Si llegamos al final ('\0') de ambas al mismo tiempo, son idénticas
        if (*cadena1 == '\0')
            return 0; // 0 significa que son iguales

        // Si son iguales pero no es el final, avanzamos ambos punteros al siguiente buzón
        cadena1++;
        cadena2++;
    }
    // Si el bucle se rompe, significa que *cadena1 y *cadena2 tienen letras distintas
    return -1;
}
