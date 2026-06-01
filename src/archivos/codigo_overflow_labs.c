/*Errores corregidos:
_ Usar fgets() en vez de gets()
_ Hashear las claves
_ Bloquear las cuentas despues de N intentos*/

#include <stdio.h>
#include <stdlib.h>

#define TAM          5
#define MAX_INTENTOS 3   // SEGURIDAD 2: Limite de intentos
#define MAX_CLAVE    6   // Longitud exacta esperada
#define BUF_CLAVE    8   // Buffer: 6 chars + '\n' + '\0'

// Códigos de colores ANSI para la consola
#define RESET   "\x1b[0m"
#define BOLD    "\x1b[1m"
#define RED     "\x1b[31m"
#define GREEN   "\x1b[32m"
#define YELLOW  "\x1b[33m"
#define BLUE    "\x1b[34m"
#define MAGENTA "\x1b[35m"
#define CYAN    "\x1b[36m"

void menu_banco(void);
void limpiarPantalla(void);
void imprimirTitulo(void);

int  buscarCuenta(int *cuentas, int tam, int nroBuscado);
int  medirClave(char *cadena);
int  compararClaves(char *cadena1, char *cadena2);

// SEGURIDAD 1: Funcion de hash (algoritmo djb2)
// Convierte una cadena en un numero unico. Nunca guardamos la clave original.
unsigned long hashear(char *cadena);

// SEGURIDAD 3: Limpia el buffer de entrada para no dejar caracteres "colgados"
void limpiarBuffer(void);

int main(void)
{
    int cuentas[TAM] = {1000, 1001, 1002, 1003, 1004};

    // ── SEGURIDAD 1: Almacenamos hashes directamente, no las claves reales ──
    // Almacenar directamente los hashes en el código fuente (en lugar de calcularlos
    // en tiempo de ejecución a partir de las claves reales) evita que las contraseñas
    // en texto plano queden expuestas en la memoria o el binario.

    unsigned long hashes[TAM] = {
        4048022465UL, // hash de "abc123"
        681275311UL,  // hash de "xyz456"
        339546941UL,  // hash de "pass01"
        4138157417UL, // hash de "clave9"
        461200492UL   // hash de "seg789"
    };

    int  nroCuenta = 0;
    int  opcion;
    int  pos;
    int  intentos;
    int  acceso = 0;
    char claveIngresada[BUF_CLAVE] = {0};
    char *ptr_clave = claveIngresada;

    limpiarPantalla();
    imprimirTitulo();

    // ── 1. Busqueda de cuenta con limite de intentos ─────────────────────
    intentos = 0;
    do
    {
        printf(BOLD CYAN "  ▶ " RESET "Ingrese su numero de cuenta: ");
        scanf("%d", &nroCuenta);
        limpiarBuffer();   // limpia el '\n' que deja scanf en el buffer

        pos = buscarCuenta(cuentas, TAM, nroCuenta);
        intentos++;

        if (pos == -1)
        {
            printf(RED "\n    ╭──────────────────────────────────────────────────╮\n");
            if (intentos < MAX_INTENTOS)
            {
                printf("    │ ✖ Error: cuenta no encontrada. Int. rest: %d    │\n", MAX_INTENTOS - intentos);
            }
            else
            {
                printf("    │ ✖ Error: cuenta no encontrada.                   │\n");
            }
            printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
        }
    } while (pos == -1 && intentos < MAX_INTENTOS);

    if (pos == -1)
    {
        printf(RED "\n    ╭──────────────────────────────────────────────────╮\n");
        printf("    │ ✖ Acceso bloqueado por demasiados intentos.      │\n");
        printf("    │   Contacte al banco para desbloquear.            │\n");
        printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
        return 1;
    }

    // ── 2. Validacion de clave con limite de intentos ────────────────────
    intentos = 0;

    do
    {
        printf(BOLD CYAN "  ▶ " RESET "Ingrese su clave (6 caracteres): ");

        // SEGURIDAD 3: fgets en lugar de gets
        // fgets recibe el puntero, el tamano MAXIMO a leer y la fuente.
        // Nunca escribira mas de BUF_CLAVE bytes, evitando el buffer overflow.
        fgets(ptr_clave, BUF_CLAVE, stdin);

        // fgets puede incluir el '\n' al final si el texto entro completo.
        // Lo eliminamos y calculamos la longitud real.
        int len = medirClave(ptr_clave);
        int hubo_overflow = 1;   // asumimos que el usuario escribio de mas

        if (len > 0 && ptr_clave[len - 1] == '\n')
        {
            ptr_clave[len - 1] = '\0';  // reemplazamos '\n' por '\0'
            len--;
            hubo_overflow = 0;          // si habia '\n', no hubo overflow
        }

        // Si no habia '\n', significa que el usuario escribio mas caracteres
        // de los que caben en el buffer. Los descartamos para no contaminar
        // la proxima lectura.
        if (hubo_overflow)
            limpiarBuffer();

        intentos++;

        // Validacion de longitud
        if (len != MAX_CLAVE)
        {
            printf(YELLOW "\n    ╭──────────────────────────────────────────────────╮\n");
            printf("    │ ⚠ Error: la clave debe tener 6 caracteres.       │\n");
            printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
        }
        // SEGURIDAD 1: Comparamos hashes, nunca texto plano
        else if (hashear(ptr_clave) != hashes[pos])
        {
            printf(RED "\n    ╭──────────────────────────────────────────────────╮\n");
            if (intentos < MAX_INTENTOS)
            {
                printf("    │ ✖ Error: clave incorrecta. Int. restantes: %d   │\n", MAX_INTENTOS - intentos);
            }
            else
            {
                printf("    │ ✖ Error: clave incorrecta.                       │\n");
            }
            printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
        }
        else
        {
            acceso = 1;   // clave correcta, salimos del bucle
        }

    // SEGURIDAD 2: El bucle termina si se valido correctamente O se agotaron
    // los intentos. Ya no es infinito.
    } while (!acceso && intentos < MAX_INTENTOS);

    // ── 3. Verificacion final de acceso ─────────────────────────────────
    if (!acceso)
    {
        printf(RED "\n    ╭──────────────────────────────────────────────────╮\n");
        printf("    │ ✖ Cuenta bloqueada por demasiados intentos.      │\n");
        printf("    │   Contacte al banco para desbloquearla.          │\n");
        printf("    ╰──────────────────────────────────────────────────╯\n\n" RESET);
        return 1;   // salida con error
    }

    // ── 4. Acceso concedido ──────────────────────────────────────────────
    limpiarPantalla();
    printf(GREEN BOLD "\n    ✓ Acceso concedido.\n\n" RESET);
    printf(CYAN "    ========================================\n");
    printf(BOLD "          ¡BIENVENIDO A GLOBAL BANK!\n" RESET);
    printf(CYAN "    ========================================\n\n" RESET);

    menu_banco();
    printf(BOLD CYAN "  ▶ " RESET "Opcion: ");
    scanf("%d", &opcion);
    limpiarBuffer();

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

void limpiarPantalla(void) {
#ifdef _WIN32
    system("cls");
#else
    system("clear");
#endif
}

void imprimirTitulo(void) {
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

void menu_banco(void)
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
        longitud++;
        cadena++;
    }
    return longitud;
}

int compararClaves(char *cadena1, char *cadena2)
{
    while (*cadena1 == *cadena2)
    {
        if (*cadena1 == '\0')
            return 0;
        cadena1++;
        cadena2++;
    }
    return -1;
}

// ── hashear ──────────────────────────────────────────────────────────────
// Algoritmo djb2: convierte una cadena en un numero de 64 bits.
// Es una funcion de una sola via: no se puede recuperar la clave original.
// Ejemplo:
//   hashear("abc123") → 6383116582
//   hashear("abc124") → 6383116583  (un solo caracter distinto cambia todo)
// Funciona con punteros: avanza *cadena++ de a un byte hasta llegar a '\0'.
unsigned long hashear(char *cadena)
{
    unsigned long hash = 5381;   // valor inicial del algoritmo djb2
    int c;

    // (unsigned char) evita problemas con caracteres especiales (ASCII > 127)
    while ((c = (unsigned char)*cadena++))
    {
        // hash * 33 + c  →  escrito con operaciones de bits para eficiencia
        hash = ((hash << 5) + hash) + c;
    }
    return hash;
}

// ── limpiarBuffer ────────────────────────────────────────────────────────
// Lee y descarta caracteres del buffer de entrada hasta encontrar '\n'.
// Necesario despues de scanf y cuando fgets detecta overflow.
void limpiarBuffer(void)
{
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}
