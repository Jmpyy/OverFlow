import{a as e,c as t,d as n,f as r,i,l as a,n as o,o as s,p as c,r as l,s as u,t as d,u as f}from"./triangle-alert-JZ4-1Q8w.js";var p=c(r(),1),m=n(),h=`#include <stdio.h>
#include <stdlib.h>

#define TAM 5

// Códigos de colores ANSI para la consola
#define RESET   "\\x1b[0m"
#define BOLD    "\\x1b[1m"
#define RED     "\\x1b[31m"
#define GREEN   "\\x1b[32m"
#define YELLOW  "\\x1b[33m"
#define BLUE    "\\x1b[34m"
#define MAGENTA "\\x1b[35m"
#define CYAN    "\\x1b[36m"

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
            printf(RED "\\n    ╭──────────────────────────────────────────────────╮\\n");
            printf("    │ ✖ Error: cuenta no encontrada. Intente de nuevo. │\\n");
            printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
        }

    } while (pos == -1);

    getchar(); // limpia el '\\n' que dejó el scanf

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
            printf(YELLOW "\\n    ╭──────────────────────────────────────────────────╮\\n");
            printf("    │ ⚠ Error: la clave debe tener 6 caracteres.       │\\n");
            printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
        }
        // Usamos nuestra función de punteros para comparar
        else if (compararClaves(ptr_clave, claves[pos]) != 0)
        {
            printf(RED "\\n    ╭──────────────────────────────────────────────────╮\\n");
            printf("    │ ✖ Error: clave incorrecta. Intente otra vez.     │\\n");
            printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
        }

    } while (medirClave(ptr_clave) != 6 || compararClaves(ptr_clave, claves[pos]) != 0);

    // ── 3. Acceso concedido ──
    limpiarPantalla();
    printf(GREEN BOLD "\\n    ✓ Acceso concedido.\\n\\n" RESET);
    printf(CYAN "    ========================================\\n");
    printf(BOLD "          ¡BIENVENIDO A GLOBAL BANK!\\n" RESET);
    printf(CYAN "    ========================================\\n\\n" RESET);

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
            printf(GREEN "\\n    ╭──────────────────────────────────────────────────╮\\n");
            printf("    │ ✓ Hasta la próxima...                            │\\n");
            printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
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
    printf("\\n");
    printf("     ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     \\n");
    printf("    ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     \\n");
    printf("    ██║  ███╗██║     ██║   ██║██████╔╝███████║██║     \\n");
    printf("    ██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     \\n");
    printf("    ╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗\\n");
    printf("     ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝\\n");
    printf("             B A N K I N G   S Y S T E M S            \\n");
    printf(RESET "\\n\\n");
}

void menu_banco()
{
    printf(BOLD BLUE);
    printf("   ╭──────────────────────────────────────╮\\n");
    printf("   │           MENÚ PRINCIPAL             │\\n");
    printf("   ├──────────────────────────────────────┤\\n");
    printf(RESET);
    printf("   │  " CYAN "1." RESET " Consultar saldo                  │\\n");
    printf("   │  " CYAN "2." RESET " Retirar dinero                   │\\n");
    printf("   │  " CYAN "3." RESET " Depositar dinero                 │\\n");
    printf("   │  " CYAN "4." RESET " Transferir                       │\\n");
    printf("   │  " CYAN "5." RESET " Ver recibo                       │\\n");
    printf(BOLD BLUE "   ├──────────────────────────────────────┤\\n");
    printf(RESET "   │  " RED "0." RESET " Salir                            │\\n");
    printf(BOLD BLUE "   ╰──────────────────────────────────────╯\\n" RESET);
    printf("\\n");
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

    while (*cadena != '\\0')
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
        // Si llegamos al final ('\\0') de ambas al mismo tiempo, son idénticas
        if (*cadena1 == '\\0')
            return 0; // 0 significa que son iguales

        // Si son iguales pero no es el final, avanzamos ambos punteros al siguiente buzón
        cadena1++;
        cadena2++;
    }
    // Si el bucle se rompe, significa que *cadena1 y *cadena2 tienen letras distintas
    return -1;
}
`,g=`/*Errores corregidos:
_ Usar fgets() en vez de gets()
_ Hashear las claves
_ Bloquear las cuentas despues de N intentos*/

#include <stdio.h>
#include <stdlib.h>

#define TAM          5
#define MAX_INTENTOS 3   // SEGURIDAD 2: Limite de intentos
#define MAX_CLAVE    6   // Longitud exacta esperada
#define BUF_CLAVE    8   // Buffer: 6 chars + '\\n' + '\\0'

// Códigos de colores ANSI para la consola
#define RESET   "\\x1b[0m"
#define BOLD    "\\x1b[1m"
#define RED     "\\x1b[31m"
#define GREEN   "\\x1b[32m"
#define YELLOW  "\\x1b[33m"
#define BLUE    "\\x1b[34m"
#define MAGENTA "\\x1b[35m"
#define CYAN    "\\x1b[36m"

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
        limpiarBuffer();   // limpia el '\\n' que deja scanf en el buffer

        pos = buscarCuenta(cuentas, TAM, nroCuenta);
        intentos++;

        if (pos == -1)
        {
            printf(RED "\\n    ╭──────────────────────────────────────────────────╮\\n");
            if (intentos < MAX_INTENTOS)
            {
                printf("    │ ✖ Error: cuenta no encontrada. Int. rest: %d    │\\n", MAX_INTENTOS - intentos);
            }
            else
            {
                printf("    │ ✖ Error: cuenta no encontrada.                   │\\n");
            }
            printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
        }
    } while (pos == -1 && intentos < MAX_INTENTOS);

    if (pos == -1)
    {
        printf(RED "\\n    ╭──────────────────────────────────────────────────╮\\n");
        printf("    │ ✖ Acceso bloqueado por demasiados intentos.      │\\n");
        printf("    │   Contacte al banco para desbloquear.            │\\n");
        printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
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

        // fgets puede incluir el '\\n' al final si el texto entro completo.
        // Lo eliminamos y calculamos la longitud real.
        int len = medirClave(ptr_clave);
        int hubo_overflow = 1;   // asumimos que el usuario escribio de mas

        if (len > 0 && ptr_clave[len - 1] == '\\n')
        {
            ptr_clave[len - 1] = '\\0';  // reemplazamos '\\n' por '\\0'
            len--;
            hubo_overflow = 0;          // si habia '\\n', no hubo overflow
        }

        // Si no habia '\\n', significa que el usuario escribio mas caracteres
        // de los que caben en el buffer. Los descartamos para no contaminar
        // la proxima lectura.
        if (hubo_overflow)
            limpiarBuffer();

        intentos++;

        // Validacion de longitud
        if (len != MAX_CLAVE)
        {
            printf(YELLOW "\\n    ╭──────────────────────────────────────────────────╮\\n");
            printf("    │ ⚠ Error: la clave debe tener 6 caracteres.       │\\n");
            printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
        }
        // SEGURIDAD 1: Comparamos hashes, nunca texto plano
        else if (hashear(ptr_clave) != hashes[pos])
        {
            printf(RED "\\n    ╭──────────────────────────────────────────────────╮\\n");
            if (intentos < MAX_INTENTOS)
            {
                printf("    │ ✖ Error: clave incorrecta. Int. restantes: %d   │\\n", MAX_INTENTOS - intentos);
            }
            else
            {
                printf("    │ ✖ Error: clave incorrecta.                       │\\n");
            }
            printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
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
        printf(RED "\\n    ╭──────────────────────────────────────────────────╮\\n");
        printf("    │ ✖ Cuenta bloqueada por demasiados intentos.      │\\n");
        printf("    │   Contacte al banco para desbloquearla.          │\\n");
        printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
        return 1;   // salida con error
    }

    // ── 4. Acceso concedido ──────────────────────────────────────────────
    limpiarPantalla();
    printf(GREEN BOLD "\\n    ✓ Acceso concedido.\\n\\n" RESET);
    printf(CYAN "    ========================================\\n");
    printf(BOLD "          ¡BIENVENIDO A GLOBAL BANK!\\n" RESET);
    printf(CYAN "    ========================================\\n\\n" RESET);

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
            printf(GREEN "\\n    ╭──────────────────────────────────────────────────╮\\n");
            printf("    │ ✓ Hasta la próxima...                            │\\n");
            printf("    ╰──────────────────────────────────────────────────╯\\n\\n" RESET);
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
    printf("\\n");
    printf("     ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     \\n");
    printf("    ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     \\n");
    printf("    ██║  ███╗██║     ██║   ██║██████╔╝███████║██║     \\n");
    printf("    ██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     \\n");
    printf("    ╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗\\n");
    printf("     ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝\\n");
    printf("             B A N K I N G   S Y S T E M S            \\n");
    printf(RESET "\\n\\n");
}

void menu_banco(void)
{
    printf(BOLD BLUE);
    printf("   ╭──────────────────────────────────────╮\\n");
    printf("   │           MENÚ PRINCIPAL             │\\n");
    printf("   ├──────────────────────────────────────┤\\n");
    printf(RESET);
    printf("   │  " CYAN "1." RESET " Consultar saldo                  │\\n");
    printf("   │  " CYAN "2." RESET " Retirar dinero                   │\\n");
    printf("   │  " CYAN "3." RESET " Depositar dinero                 │\\n");
    printf("   │  " CYAN "4." RESET " Transferir                       │\\n");
    printf("   │  " CYAN "5." RESET " Ver recibo                       │\\n");
    printf(BOLD BLUE "   ├──────────────────────────────────────┤\\n");
    printf(RESET "   │  " RED "0." RESET " Salir                            │\\n");
    printf(BOLD BLUE "   ╰──────────────────────────────────────╯\\n" RESET);
    printf("\\n");
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
    while (*cadena != '\\0')
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
        if (*cadena1 == '\\0')
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
// Funciona con punteros: avanza *cadena++ de a un byte hasta llegar a '\\0'.
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
// Lee y descarta caracteres del buffer de entrada hasta encontrar '\\n'.
// Necesario despues de scanf y cuando fgets detecta overflow.
void limpiarBuffer(void)
{
    int c;
    while ((c = getchar()) != '\\n' && c != EOF);
}
`,_=`/OverFlow/assets/Leonel-D3VgKB9f.jpg`,v=u(`building`,[[`path`,{d:`M12 10h.01`,key:`1nrarc`}],[`path`,{d:`M12 14h.01`,key:`1etili`}],[`path`,{d:`M12 6h.01`,key:`1vi96p`}],[`path`,{d:`M16 10h.01`,key:`1m94wz`}],[`path`,{d:`M16 14h.01`,key:`1gbofw`}],[`path`,{d:`M16 6h.01`,key:`1x0f13`}],[`path`,{d:`M8 10h.01`,key:`19clt8`}],[`path`,{d:`M8 14h.01`,key:`6423bh`}],[`path`,{d:`M8 6h.01`,key:`1dz90k`}],[`path`,{d:`M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3`,key:`cabbwy`}],[`rect`,{x:`4`,y:`2`,width:`16`,height:`20`,rx:`2`,key:`1uxh74`}]]),y=u(`circle-check`,[[`circle`,{cx:`12`,cy:`12`,r:`10`,key:`1mglay`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]),b=u(`lock`,[[`rect`,{width:`18`,height:`11`,x:`3`,y:`11`,rx:`2`,ry:`2`,key:`1w4ew1`}],[`path`,{d:`M7 11V7a5 5 0 0 1 10 0v4`,key:`fwvmzm`}]]),x=u(`menu`,[[`path`,{d:`M4 5h16`,key:`1tepv9`}],[`path`,{d:`M4 12h16`,key:`1lakjw`}],[`path`,{d:`M4 19h16`,key:`1djgab`}]]),S=u(`play`,[[`path`,{d:`M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z`,key:`10ikf1`}]]),C=u(`search`,[[`path`,{d:`m21 21-4.34-4.34`,key:`14j7rj`}],[`circle`,{cx:`11`,cy:`11`,r:`8`,key:`4ej97u`}]]),w=u(`shield-check`,[[`path`,{d:`M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z`,key:`oel41y`}],[`path`,{d:`m9 12 2 2 4-4`,key:`dzmm74`}]]),T=u(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]),E=f(),D=({className:e})=>(0,E.jsxs)(`svg`,{xmlns:`http://www.w3.org/2000/svg`,width:`24`,height:`24`,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:`2`,strokeLinecap:`round`,strokeLinejoin:`round`,className:e,children:[(0,E.jsx)(`path`,{d:`M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4`}),(0,E.jsx)(`path`,{d:`M9 18c-4.51 2-5-2-7-2`})]}),O=[`     ██████╗ ██╗      ██████╗ ██████╗  █████╗ ██╗     `,`    ██╔════╝ ██║     ██╔═══██╗██╔══██╗██╔══██╗██║     `,`    ██║  ███╗██║     ██║   ██║██████╔╝███████║██║     `,`    ██║   ██║██║     ██║   ██║██╔══██╗██╔══██║██║     `,`    ╚██████╔╝███████╗╚██████╔╝██████╔╝██║  ██║███████╗`,`     ╚═════╝ ╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝`,`             B A N K I N G   S Y S T E M S            `],k=e=>[{type:`system`,text:e===`vulnerable`?`$ ./demo.exe`:`$ ./seguro.exe`},{type:`ascii`,text:``},...O.map(e=>({type:`ascii`,text:e})),{type:`ascii`,text:``},{type:`prompt_with_input`,text:`Ingrese su numero de cuenta: 1000`},{type:`prompt`,text:`Ingrese su clave (6 caracteres): `}],A=()=>{let[e,t]=(0,p.useState)(`vulnerable`),[n,r]=(0,p.useState)(k(`vulnerable`)),[i,a]=(0,p.useState)(``),[c,u]=(0,p.useState)(!1),d=p.useRef(null);p.useEffect(()=>{d.current&&d.current.scrollTo({top:d.current.scrollHeight,behavior:`smooth`})},[n]);let f=e=>{t(e),r(k(e)),a(``)};return(0,E.jsxs)(`div`,{className:`flex flex-col lg:flex-row gap-8 items-stretch`,children:[(0,E.jsx)(`div`,{className:`w-full lg:w-1/3 flex flex-col gap-4`,children:(0,E.jsxs)(`div`,{className:`bg-[#112240] rounded-xl border border-[#64ffda]/20 p-6 flex flex-col h-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative overflow-hidden`,children:[(0,E.jsx)(`h3`,{className:`text-xl font-bold text-[#e6f1ff] mb-4 relative z-10`,children:`Panel de Control`}),(0,E.jsx)(`p`,{className:`text-gray-400 text-sm mb-6 relative z-10`,children:`Seleccione el modo de ejecución para probar cómo reacciona el sistema ante entradas maliciosas.`}),(0,E.jsxs)(`div`,{className:`flex flex-col gap-4 relative z-10`,children:[(0,E.jsxs)(`button`,{onClick:()=>f(`vulnerable`),className:`flex items-center gap-3 p-4 rounded-lg border transition-all ${e===`vulnerable`?`bg-[#ff6b6b]/10 border-[#ff6b6b] text-[#ff6b6b]`:`bg-[#0a192f] border-[#ff6b6b]/30 text-gray-400 hover:border-[#ff6b6b]/60`}`,children:[(0,E.jsx)(s,{className:`w-5 h-5 flex-shrink-0`}),(0,E.jsxs)(`div`,{className:`text-left`,children:[(0,E.jsx)(`div`,{className:`font-bold`,children:`Modo Vulnerable`}),(0,E.jsx)(`div`,{className:`text-xs opacity-80`,children:`Usa función gets()`})]})]}),(0,E.jsxs)(`button`,{onClick:()=>f(`secure`),className:`flex items-center gap-3 p-4 rounded-lg border transition-all ${e===`secure`?`bg-[#64ffda]/10 border-[#64ffda] text-[#64ffda]`:`bg-[#0a192f] border-[#64ffda]/30 text-gray-400 hover:border-[#64ffda]/60`}`,children:[(0,E.jsx)(l,{className:`w-5 h-5 flex-shrink-0`}),(0,E.jsxs)(`div`,{className:`text-left`,children:[(0,E.jsx)(`div`,{className:`font-bold`,children:`Modo Seguro`}),(0,E.jsx)(`div`,{className:`text-xs opacity-80`,children:`Usa función fgets()`})]})]})]}),(0,E.jsxs)(`div`,{className:`mt-8 relative z-10`,children:[(0,E.jsx)(`h4`,{className:`text-sm font-semibold text-[#e6f1ff] mb-2`,children:`Instrucciones:`}),(0,E.jsxs)(`ul`,{className:`text-xs text-gray-400 space-y-2 list-disc pl-4`,children:[(0,E.jsx)(`li`,{children:`Intente ingresar una clave normal (ej: 123456)`}),(0,E.jsx)(`li`,{children:`Intente ingresar una clave larga (ej: AAAAAAAAAA)`})]})]})]})}),(0,E.jsxs)(`div`,{className:`w-full lg:w-2/3 flex flex-col bg-[#0a192f] rounded-xl border border-[#64ffda]/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden font-mono text-sm relative`,children:[(0,E.jsxs)(`div`,{className:`bg-[#112240] px-4 py-3 flex items-center justify-between border-b border-[#64ffda]/20`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#ff5f56]`}),(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#ffbd2e]`}),(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#27c93f]`})]}),(0,E.jsx)(`span`,{className:`text-[#8892b0] text-xs`,children:e===`vulnerable`?`root@globalbank-server:~ (Vulnerable)`:`root@globalbank-server:~ (Seguro)`}),(0,E.jsx)(o,{className:`w-4 h-4 text-[#8892b0]`})]}),(0,E.jsx)(`div`,{ref:d,className:`p-4 flex-grow overflow-y-auto h-[400px] bg-[#020c1b] text-gray-300`,children:n.map((e,t)=>(0,E.jsx)(`div`,{className:`mb-1 ${e.type===`error`?`text-[#ff6b6b]`:e.type===`success`?`text-[#64ffda]`:e.type===`warning`?`text-[#ffbd2e]`:e.type===`hacked`?`text-[#c678dd] font-bold`:e.type===`hacked_input`?`text-gray-300`:e.type===`system`?`text-[#56b6c2]`:e.type===`ascii`?`text-[#64ffda] font-bold whitespace-pre`:e.type===`prompt_with_input`?`text-gray-300`:e.type===`prompt`?`text-[#64ffda] font-bold`:``}`,children:e.type.startsWith(`prompt`)?(0,E.jsxs)(E.Fragment,{children:[(0,E.jsx)(`span`,{className:`text-[#64ffda] font-bold`,children:`  ▶ `}),(0,E.jsx)(`span`,{className:(e.type,`text-gray-300`),children:e.text})]}):e.text},t))}),(0,E.jsxs)(`form`,{onSubmit:async t=>{if(t.preventDefault(),!i.trim()||c)return;let o=i;if(a(``),u(!0),n.some(e=>e.text&&e.text.includes(`root@globalbank-atm:~#`))){r(e=>[...e,{type:`hacked_input`,text:`root@globalbank-atm:~# ${o}`},{type:`hacked`,text:`bash: ${o}: command not found`}]),u(!1);return}if(r(e=>[...e.slice(0,e.length-1),{type:`prompt_with_input`,text:`Ingrese su clave (6 caracteres): ${o}`}]),await new Promise(e=>setTimeout(e,600)),e===`vulnerable`)if(o.length>6){let e=o.substring(6),t=Array.from(e).map(e=>e.charCodeAt(0).toString(16)).join(``).toUpperCase().padEnd(8,`0`).substring(0,8);r(e=>[...e,{type:`error`,text:`*** stack smashing detected ***: terminated`},{type:`error`,text:`Aborted (core dumped)`},{type:`system`,text:` `},{type:`hacked`,text:`[!] Registro EIP sobrescrito con: 0x${t}`},{type:`hacked`,text:`[!] Ejecutando shellcode...`},{type:`system`,text:` `},{type:`hacked`,text:`root@globalbank-atm:~# id`},{type:`hacked`,text:`uid=0(root) gid=0(root) groups=0(root)`},{type:`system`,text:` `},{type:`error`,text:`SISTEMA COMPROMETIDO. CONTROL TOTAL OBTENIDO.`}])}else r(e=>[...e,{type:`success`,text:`✓ Acceso concedido.`},{type:`system`,text:` `},{type:`prompt`,text:`Ingrese su clave (6 caracteres): `}]);else o.length>6?r(e=>[...e,{type:`warning`,text:`Advertencia: Entrada excedió límite de buffer (6 chars). Truncando a 6...`},{type:`error`,text:`✖ Error: clave incorrecta.`},{type:`system`,text:` `},{type:`prompt`,text:`Ingrese su clave (6 caracteres): `}]):r(e=>[...e,{type:`success`,text:`✓ Acceso concedido.`},{type:`system`,text:` `},{type:`prompt`,text:`Ingrese su clave (6 caracteres): `}]);u(!1)},className:`flex border-t border-[#64ffda]/20 bg-[#112240] relative`,children:[(0,E.jsx)(`span`,{className:`px-4 py-3 text-[#64ffda] font-bold whitespace-pre`,children:n.some(e=>e.text&&e.text.includes(`root@globalbank-atm:~#`))?`root@globalbank-atm:~#`:`  ▶ `}),(0,E.jsx)(`input`,{type:`text`,value:i,onChange:e=>a(e.target.value),disabled:c,className:`flex-grow bg-transparent border-none outline-none text-[#e6f1ff] py-3 pr-4 font-mono disabled:opacity-50`,autoFocus:!0,autoComplete:`off`,spellCheck:`false`})]})]})]})};function j(){let[n,r]=(0,p.useState)(!1),c={hidden:{opacity:0,y:30},visible:{opacity:1,y:0,transition:{duration:.8,ease:`easeOut`}}},u={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.2}}};return(0,E.jsxs)(`div`,{className:`min-h-screen bg-[#020c1b] text-[#8892b0] font-sans selection:bg-[#64ffda] selection:text-[#020c1b] flex flex-col relative overflow-hidden`,children:[(0,E.jsxs)(`div`,{className:`fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0`,children:[(0,E.jsx)(t.div,{animate:{x:[0,50,-50,0],y:[0,30,-30,0],scale:[1,1.1,.9,1]},transition:{duration:15,repeat:1/0,ease:`easeInOut`},className:`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#64ffda]/10 blur-[150px]`}),(0,E.jsx)(t.div,{animate:{x:[0,-60,40,0],y:[0,-40,50,0],scale:[1,1.2,.8,1]},transition:{duration:20,repeat:1/0,ease:`easeInOut`},className:`absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-[#0a192f] blur-[120px]`})]}),(0,E.jsxs)(t.header,{initial:{y:-100},animate:{y:0},transition:{duration:.8,ease:`easeOut`},className:`fixed w-full top-0 z-50 bg-[#0a192f]/70 backdrop-blur-xl border-b border-[#64ffda]/10`,children:[(0,E.jsxs)(`div`,{className:`max-w-7xl mx-auto px-6 h-20 flex items-center justify-between`,children:[(0,E.jsxs)(t.div,{whileHover:{scale:1.05},className:`flex items-center gap-3 cursor-pointer group`,children:[(0,E.jsxs)(`div`,{className:`relative`,children:[(0,E.jsx)(`div`,{className:`absolute inset-0 bg-[#64ffda] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-500 rounded-full`}),(0,E.jsx)(`img`,{src:`/logo.png`,alt:`Overflow Labs Logo`,className:`w-auto h-12 relative z-10 rounded`})]}),(0,E.jsxs)(`span`,{className:`text-xl font-bold text-[#e6f1ff] tracking-wider ml-2`,children:[`OVERFLOW `,(0,E.jsx)(`span`,{className:`text-[#64ffda]`,children:`LABS`})]})]}),(0,E.jsx)(`nav`,{className:`hidden md:flex items-center gap-8`,children:[`Nosotros`,`Caso de Estudio`,`Demo`,`Herramientas`,`Presentación`,`Equipo`].map(e=>(0,E.jsx)(t.a,{href:`#${e.toLowerCase().replace(/ /g,`-`).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``)}`,whileHover:{y:-2,color:`#64ffda`},className:`text-sm font-medium text-[#e6f1ff] transition-colors`,children:e},e))}),(0,E.jsx)(`button`,{className:`md:hidden text-[#e6f1ff] hover:text-[#64ffda] transition-colors`,onClick:()=>r(!n),children:n?(0,E.jsx)(T,{className:`w-6 h-6`}):(0,E.jsx)(x,{className:`w-6 h-6`})})]}),(0,E.jsx)(a,{children:n&&(0,E.jsx)(t.div,{initial:{opacity:0,height:0},animate:{opacity:1,height:`auto`},exit:{opacity:0,height:0},className:`md:hidden absolute top-20 left-0 w-full bg-[#112240]/95 backdrop-blur-xl border-b border-[#64ffda]/10 px-6 py-4 flex flex-col gap-4 overflow-hidden`,children:[`Nosotros`,`Caso de Estudio`,`Demo`,`Herramientas`,`Presentación`,`Equipo`].map(e=>(0,E.jsx)(`a`,{href:`#${e.toLowerCase().replace(/ /g,`-`).normalize(`NFD`).replace(/[\u0300-\u036f]/g,``)}`,onClick:()=>r(!1),className:`text-sm font-medium text-[#e6f1ff] hover:text-[#64ffda]`,children:e},e))})})]}),(0,E.jsxs)(`main`,{className:`flex-grow z-10 pt-20`,children:[(0,E.jsx)(`section`,{className:`min-h-[90vh] flex items-center justify-center px-6 py-20 relative`,children:(0,E.jsxs)(`div`,{className:`max-w-4xl mx-auto text-center`,children:[(0,E.jsxs)(t.div,{initial:{opacity:0,scale:.8},animate:{opacity:1,scale:1},transition:{duration:.8,delay:.2},className:`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#64ffda]/10 text-[#64ffda] text-xs font-mono mb-8 border border-[#64ffda]/20 backdrop-blur-sm`,children:[(0,E.jsx)(b,{className:`w-4 h-4`}),(0,E.jsx)(`span`,{children:`Ciberseguridad de Nivel Empresarial`})]}),(0,E.jsxs)(t.h1,{initial:{opacity:0,y:40},animate:{opacity:1,y:0},transition:{duration:.8,delay:.4},className:`text-5xl md:text-7xl font-bold text-[#e6f1ff] leading-tight mb-6`,children:[`Protegemos sus activos digitales `,(0,E.jsx)(`span`,{className:`text-[#64ffda] glow-text inline-block`,children:`más críticos.`})]}),(0,E.jsx)(t.p,{initial:{opacity:0},animate:{opacity:1},transition:{duration:.8,delay:.6},className:`text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 text-[#8892b0]`,children:`Especialistas en Auditoría de Código Seguro y prevención de Desbordamientos de Búfer para el sector financiero en América Latina.`}),(0,E.jsxs)(t.a,{href:`#demo`,initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.8,delay:.8},whileHover:{scale:1.05},whileTap:{scale:.95},className:`group relative inline-flex items-center justify-center px-8 py-4 font-medium text-[#020c1b] bg-[#64ffda] rounded overflow-hidden shadow-[0_0_20px_rgba(100,255,218,0.4)] hover:shadow-[0_0_40px_rgba(100,255,218,0.6)] transition-shadow duration-300`,children:[(0,E.jsx)(`span`,{className:`absolute inset-0 w-full h-full -mt-1 rounded opacity-30 bg-gradient-to-b from-transparent via-transparent to-black`}),(0,E.jsxs)(`span`,{className:`relative flex items-center gap-2`,children:[`Ver Demo Técnica`,(0,E.jsx)(t.div,{animate:{x:[0,5,0]},transition:{repeat:1/0,duration:1.5},children:(0,E.jsx)(e,{className:`w-5 h-5`})})]})]})]})}),(0,E.jsx)(t.section,{id:`nosotros`,className:`py-24 bg-[#0a192f]/50 relative`,initial:`hidden`,whileInView:`visible`,viewport:{once:!0,margin:`-100px`},variants:c,children:(0,E.jsx)(`div`,{className:`max-w-7xl mx-auto px-6`,children:(0,E.jsxs)(`div`,{className:`flex flex-col md:flex-row gap-16 items-center`,children:[(0,E.jsxs)(`div`,{className:`w-full md:w-1/2`,children:[(0,E.jsxs)(`h2`,{className:`text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-6 flex items-center gap-3`,children:[(0,E.jsx)(l,{className:`w-8 h-8 text-[#64ffda]`}),`Nuestra Misión y Visión`]}),(0,E.jsx)(t.div,{initial:{width:0},whileInView:{width:80},transition:{duration:1,delay:.5},className:`h-1 bg-[#64ffda] mb-8 rounded-full`}),(0,E.jsx)(`p`,{className:`text-lg leading-relaxed mb-6`,children:`En Overflow Labs, nos dedicamos incansablemente a erradicar vulnerabilidades de memoria en software de bajo nivel, especialmente en lenguajes como C y C++.`}),(0,E.jsx)(`p`,{className:`text-lg leading-relaxed`,children:`Nuestra misión es garantizar la máxima seguridad operativa para infraestructuras críticas, blindando sistemas financieros contra ataques de ejecución de código arbitrario y explotación de memoria.`})]}),(0,E.jsx)(t.div,{whileHover:{rotateY:5,rotateX:5,scale:1.02},className:`w-full md:w-1/2 perspective-1000`,children:(0,E.jsxs)(`div`,{className:`relative rounded-xl overflow-hidden border border-[#64ffda]/20 bg-[#112240]/80 backdrop-blur-md p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]`,children:[(0,E.jsx)(`div`,{className:`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#64ffda] to-transparent opacity-50`}),(0,E.jsx)(`pre`,{className:`font-mono text-sm text-[#8892b0] overflow-x-auto`,children:(0,E.jsxs)(`code`,{children:[(0,E.jsx)(`span`,{className:`text-gray-500`,children:`// Misión de Seguridad`}),`
`,(0,E.jsx)(`span`,{className:`text-[#c678dd]`,children:`int`}),` `,(0,E.jsx)(`span`,{className:`text-[#61afef]`,children:`secure_system`}),`() `,`{`,`
`,`  `,(0,E.jsx)(`span`,{className:`text-[#c678dd]`,children:`while`}),`(threats_exist) `,`{`,`
`,`    `,(0,E.jsx)(t.span,{animate:{opacity:[1,.5,1]},transition:{repeat:1/0,duration:2},className:`text-[#56b6c2]`,children:`audit_code`}),`();`,`
`,`    `,(0,E.jsx)(`span`,{className:`text-[#56b6c2]`,children:`patch_vulnerabilities`}),`();`,`
`,`  `,`}`,`
`,`  `,(0,E.jsx)(`span`,{className:`text-[#c678dd]`,children:`return`}),` `,(0,E.jsx)(`span`,{className:`text-[#d19a66]`,children:`MAXIMUM_SECURITY`}),`;`,`
`,`}`]})})]})})]})})}),(0,E.jsx)(t.section,{id:`caso-de-estudio`,className:`py-24`,initial:`hidden`,whileInView:`visible`,viewport:{once:!0,margin:`-100px`},variants:c,children:(0,E.jsxs)(`div`,{className:`max-w-7xl mx-auto px-6`,children:[(0,E.jsxs)(`div`,{className:`text-center mb-16`,children:[(0,E.jsx)(`h2`,{className:`text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4`,children:`El Problema y la Solución`}),(0,E.jsx)(t.div,{initial:{width:0},whileInView:{width:80},transition:{duration:1,delay:.3},className:`h-1 bg-[#64ffda] mx-auto mb-6 rounded-full`}),(0,E.jsx)(`p`,{className:`text-lg max-w-2xl mx-auto`,children:`Cómo salvamos a una institución financiera de un ataque crítico de día cero.`})]}),(0,E.jsxs)(t.div,{whileHover:{y:-5},className:`bg-[#112240]/60 backdrop-blur-lg rounded-2xl border border-[#64ffda]/20 overflow-hidden flex flex-col lg:flex-row shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative`,children:[(0,E.jsx)(`div`,{className:`absolute inset-0 bg-gradient-to-br from-[#64ffda]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500`}),(0,E.jsxs)(`div`,{className:`w-full lg:w-1/2 p-10 border-b lg:border-b-0 lg:border-r border-[#64ffda]/10 flex flex-col justify-center relative z-10`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-3 mb-6`,children:[(0,E.jsx)(v,{className:`w-6 h-6 text-[#64ffda]`}),(0,E.jsx)(`h3`,{className:`text-2xl font-bold text-[#e6f1ff]`,children:`Banco "GlobalBank"`})]}),(0,E.jsxs)(`div`,{className:`mb-6`,children:[(0,E.jsxs)(`div`,{className:`flex items-start gap-3 text-[#ff6b6b] mb-2`,children:[(0,E.jsx)(t.div,{animate:{scale:[1,1.2,1]},transition:{repeat:1/0,duration:2},children:(0,E.jsx)(d,{className:`w-5 h-5 mt-1 flex-shrink-0`})}),(0,E.jsx)(`h4`,{className:`text-xl font-semibold`,children:`El Problema Crítico`})]}),(0,E.jsxs)(`p`,{className:`pl-8 text-gray-300`,children:[`Hackers lograron evadir las pantallas de inicio de sesión de los cajeros automáticos explotando un `,(0,E.jsx)(`strong`,{className:`text-[#ff6b6b]`,children:`Desbordamiento de Búfer`}),`. La vulnerabilidad permitía la ejecución de código remoto.`]})]})]}),(0,E.jsx)(`div`,{className:`w-full lg:w-1/2 p-10 bg-[#0a192f]/80 flex flex-col justify-center relative z-10`,children:(0,E.jsxs)(`div`,{className:`mb-6`,children:[(0,E.jsxs)(`div`,{className:`flex items-start gap-3 text-[#64ffda] mb-2`,children:[(0,E.jsx)(y,{className:`w-5 h-5 mt-1 flex-shrink-0`}),(0,E.jsx)(`h4`,{className:`text-xl font-semibold`,children:`Nuestra Solución`})]}),(0,E.jsxs)(`p`,{className:`pl-8 mb-6 text-gray-300`,children:[`Reemplazamos la función insegura `,(0,E.jsx)(`code`,{className:`text-[#ff6b6b] bg-[#ff6b6b]/10 px-1.5 py-0.5 rounded border border-[#ff6b6b]/20`,children:`gets()`}),` por su alternativa segura `,(0,E.jsx)(`code`,{className:`text-[#64ffda] bg-[#64ffda]/10 px-1.5 py-0.5 rounded border border-[#64ffda]/20`,children:`fgets()`}),`, implementando límites estrictos de memoria.`]}),(0,E.jsx)(t.div,{initial:{opacity:0,x:-20},whileInView:{opacity:1,x:0},transition:{delay:.5},className:`pl-8`,children:(0,E.jsxs)(`div`,{className:`bg-[#112240] rounded-lg p-5 border-l-4 border-[#64ffda] shadow-lg`,children:[(0,E.jsx)(`p`,{className:`text-sm font-bold text-[#e6f1ff] mb-1`,children:`Resultado:`}),(0,E.jsx)(`p`,{className:`text-sm text-gray-400`,children:`Ataque bloqueado exitosamente, previniendo pérdidas millonarias y restaurando la confianza del cliente.`})]})})]})})]})]})}),(0,E.jsx)(`section`,{id:`herramientas`,className:`py-24 bg-[#0a192f]/50 relative overflow-hidden`,children:(0,E.jsxs)(`div`,{className:`max-w-7xl mx-auto px-6`,children:[(0,E.jsxs)(t.div,{initial:`hidden`,whileInView:`visible`,viewport:{once:!0},variants:c,className:`text-center mb-16`,children:[(0,E.jsx)(`h2`,{className:`text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4`,children:`Tecnologías que utilizamos`}),(0,E.jsx)(`div`,{className:`w-20 h-1 bg-[#64ffda] mx-auto mb-6 rounded-full`}),(0,E.jsx)(`p`,{className:`text-lg max-w-2xl mx-auto`,children:`Herramientas de grado industrial para análisis profundo y mitigación de amenazas.`})]}),(0,E.jsxs)(t.div,{className:`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto`,variants:u,initial:`hidden`,whileInView:`visible`,viewport:{once:!0},children:[(0,E.jsxs)(t.div,{variants:c,whileHover:{y:-10,scale:1.02},className:`group bg-[#112240]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#64ffda]/10 hover:border-[#64ffda]/50 transition-all duration-300 shadow-xl relative overflow-hidden`,children:[(0,E.jsx)(`div`,{className:`absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-150`}),(0,E.jsx)(i,{className:`w-12 h-12 text-[#64ffda] mb-6 relative z-10`}),(0,E.jsx)(`h3`,{className:`text-2xl font-bold text-[#e6f1ff] mb-3 relative z-10 group-hover:text-[#64ffda] transition-colors`,children:`Cppcheck`}),(0,E.jsx)(`div`,{className:`inline-block px-3 py-1 bg-[#64ffda]/10 text-[#64ffda] text-xs font-mono rounded-full mb-4 relative z-10 border border-[#64ffda]/20`,children:`Análisis Estático`}),(0,E.jsx)(`p`,{className:`relative z-10 text-gray-400`,children:`Herramienta avanzada de análisis estático diseñada para detectar bugs indefinidos y construcciones peligrosas en bases de código C/C++, incluso antes de la compilación.`})]}),(0,E.jsxs)(t.div,{variants:c,whileHover:{y:-10,scale:1.02},className:`group bg-[#112240]/80 backdrop-blur-sm p-8 rounded-2xl border border-[#64ffda]/10 hover:border-[#64ffda]/50 transition-all duration-300 shadow-xl relative overflow-hidden`,children:[(0,E.jsx)(`div`,{className:`absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-bl-[100px] -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-150`}),(0,E.jsx)(o,{className:`w-12 h-12 text-[#64ffda] mb-6 relative z-10`}),(0,E.jsx)(`h3`,{className:`text-2xl font-bold text-[#e6f1ff] mb-3 relative z-10 group-hover:text-[#64ffda] transition-colors`,children:`GDB`}),(0,E.jsx)(`div`,{className:`inline-block px-3 py-1 bg-[#64ffda]/10 text-[#64ffda] text-xs font-mono rounded-full mb-4 relative z-10 border border-[#64ffda]/20`,children:`Depuración de Memoria`}),(0,E.jsx)(`p`,{className:`relative z-10 text-gray-400`,children:`El depurador GNU nos permite inspeccionar el estado exacto de la memoria y la pila de ejecución en tiempo real para identificar desbordamientos y fugas de datos.`})]})]})]})}),(0,E.jsx)(`section`,{id:`demo`,className:`py-24 relative overflow-hidden`,children:(0,E.jsxs)(`div`,{className:`max-w-7xl mx-auto px-6`,children:[(0,E.jsxs)(t.div,{initial:`hidden`,whileInView:`visible`,viewport:{once:!0},variants:c,className:`text-center mb-16`,children:[(0,E.jsx)(`h2`,{className:`text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4`,children:`Demostración de Código`}),(0,E.jsx)(`div`,{className:`w-20 h-1 bg-[#64ffda] mx-auto mb-6 rounded-full`}),(0,E.jsx)(`p`,{className:`text-lg max-w-2xl mx-auto`,children:`Comparativa del código vulnerable del cliente vs nuestra implementación segura.`})]}),(0,E.jsxs)(`div`,{className:`flex flex-col lg:flex-row gap-8 mb-12`,children:[(0,E.jsxs)(t.div,{initial:{opacity:0,x:-30},whileInView:{opacity:1,x:0},transition:{duration:.6},viewport:{once:!0},className:`w-full lg:w-1/2 rounded-xl overflow-hidden border border-[#ff6b6b]/30 bg-[#112240] flex flex-col shadow-[0_10px_30px_rgba(255,107,107,0.15)] max-h-[500px]`,children:[(0,E.jsxs)(`div`,{className:`bg-[#0a192f] border-b border-[#ff6b6b]/20 px-4 py-3 flex items-center justify-between`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#ff5f56]`}),(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#ffbd2e]`}),(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#27c93f]`})]}),(0,E.jsxs)(`span`,{className:`text-xs font-mono text-[#ff6b6b] flex items-center gap-2`,children:[(0,E.jsx)(s,{className:`w-3 h-3`}),` codigo_cliente.c`]})]}),(0,E.jsx)(`div`,{className:`p-4 overflow-y-auto overflow-x-auto text-xs font-mono text-gray-300 flex-grow scrollbar-thin scrollbar-thumb-[#ff6b6b]/20`,children:(0,E.jsx)(`pre`,{children:(0,E.jsx)(`code`,{children:h})})})]}),(0,E.jsxs)(t.div,{initial:{opacity:0,x:30},whileInView:{opacity:1,x:0},transition:{duration:.6},viewport:{once:!0},className:`w-full lg:w-1/2 rounded-xl overflow-hidden border border-[#64ffda]/30 bg-[#112240] flex flex-col shadow-[0_10px_30px_rgba(100,255,218,0.15)] max-h-[500px]`,children:[(0,E.jsxs)(`div`,{className:`bg-[#0a192f] border-b border-[#64ffda]/20 px-4 py-3 flex items-center justify-between`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#ff5f56]`}),(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#ffbd2e]`}),(0,E.jsx)(`div`,{className:`w-3 h-3 rounded-full bg-[#27c93f]`})]}),(0,E.jsxs)(`span`,{className:`text-xs font-mono text-[#64ffda] flex items-center gap-2`,children:[(0,E.jsx)(l,{className:`w-3 h-3`}),` codigo_overflow_labs.c`]})]}),(0,E.jsx)(`div`,{className:`p-4 overflow-y-auto overflow-x-auto text-xs font-mono text-gray-300 flex-grow scrollbar-thin scrollbar-thumb-[#64ffda]/20`,children:(0,E.jsx)(`pre`,{children:(0,E.jsx)(`code`,{children:g})})})]})]}),(0,E.jsx)(A,{}),(0,E.jsxs)(t.div,{initial:{opacity:0,y:20},whileInView:{opacity:1,y:0},transition:{delay:.4},viewport:{once:!0},className:`mt-12 bg-[#112240] p-6 rounded-xl border border-[#64ffda]/10 text-center max-w-3xl mx-auto`,children:[(0,E.jsx)(`h4`,{className:`text-lg font-semibold text-[#e6f1ff] mb-2`,children:`Explicación Técnica`}),(0,E.jsxs)(`p`,{className:`text-gray-400 text-sm leading-relaxed`,children:[`La función `,(0,E.jsx)(`code`,{className:`text-[#ff6b6b]`,children:`gets()`}),` lee caracteres de la entrada estándar hasta encontrar un salto de línea, sin verificar si el búfer de destino tiene espacio suficiente. Esto permite a un atacante introducir más datos de los esperados, sobrescribiendo zonas adyacentes de memoria (Buffer Overflow) y potencialmente ejecutando código arbitrario. Al reemplazarla con `,(0,E.jsx)(`code`,{className:`text-[#64ffda]`,children:`fgets()`}),`, establecemos un límite estricto de lectura basado en el tamaño del búfer, mitigando completamente el vector de ataque.`]})]})]})}),(0,E.jsxs)(t.section,{id:`presentacion`,className:`py-24 bg-[#0a192f]/50 relative overflow-hidden`,initial:`hidden`,whileInView:`visible`,viewport:{once:!0,margin:`-100px`},variants:c,children:[(0,E.jsx)(`div`,{className:`absolute top-[20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#64ffda]/5 blur-[80px] pointer-events-none`}),(0,E.jsxs)(`div`,{className:`max-w-7xl mx-auto px-6 relative z-10`,children:[(0,E.jsxs)(`div`,{className:`text-center mb-16`,children:[(0,E.jsxs)(`h2`,{className:`text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4 flex items-center justify-center gap-3`,children:[(0,E.jsx)(S,{className:`w-8 h-8 text-[#64ffda] animate-pulse`}),`Presentación del Caso de Éxito`]}),(0,E.jsx)(`div`,{className:`w-20 h-1 bg-[#64ffda] mx-auto mb-6 rounded-full`}),(0,E.jsx)(`p`,{className:`text-lg max-w-2xl mx-auto`,children:`Acceda a nuestra presentación interactiva a pantalla completa detallando la auditoría de ciberseguridad, análisis de vulnerabilidades y remediación.`})]}),(0,E.jsxs)(`div`,{className:`max-w-4xl mx-auto bg-[#112240]/60 backdrop-blur-md rounded-2xl border border-[#64ffda]/20 overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.5)] p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative`,children:[(0,E.jsx)(`div`,{className:`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#64ffda] to-transparent`}),(0,E.jsxs)(`div`,{className:`flex-grow space-y-4 text-left`,children:[(0,E.jsxs)(`div`,{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#64ffda]/10 text-[#64ffda] text-xs font-mono border border-[#64ffda]/20`,children:[(0,E.jsx)(o,{className:`w-3.5 h-3.5`}),(0,E.jsx)(`span`,{children:`DECK COMPLETO - 10 DIAPOSITIVAS`})]}),(0,E.jsx)(`h3`,{className:`text-2xl font-bold text-white`,children:`Diapositivas Ejecutivas de Ciberseguridad`}),(0,E.jsxs)(`p`,{className:`text-gray-400 text-sm leading-relaxed`,children:[`Presentamos el desglose técnico de la intrusión y remediación realizada para `,(0,E.jsx)(`strong`,{children:`GlobalBank`}),`. Incluye un simulador de desbordamiento de pila interactivo, herramientas de diagnóstico de DevSecOps como Cppcheck y GDB, y la comparación del impacto del código de bajo nivel.`]}),(0,E.jsxs)(`div`,{className:`flex flex-wrap gap-2 text-xs font-mono text-gray-400`,children:[(0,E.jsx)(`span`,{className:`bg-[#0a192f] px-2.5 py-1 rounded border border-white/5`,children:`• Portada`}),(0,E.jsx)(`span`,{className:`bg-[#0a192f] px-2.5 py-1 rounded border border-white/5`,children:`• Caso GlobalBank`}),(0,E.jsx)(`span`,{className:`bg-[#0a192f] px-2.5 py-1 rounded border border-white/5`,children:`• Auditoría C`}),(0,E.jsx)(`span`,{className:`bg-[#0a192f] px-2.5 py-1 rounded border border-white/5`,children:`• Terminal de Ataque`}),(0,E.jsx)(`span`,{className:`bg-[#0a192f] px-2.5 py-1 rounded border border-white/5`,children:`• Remediación`})]})]}),(0,E.jsx)(`div`,{className:`flex-shrink-0 w-full md:w-auto`,children:(0,E.jsxs)(`a`,{href:`./presentacion.html`,target:`_blank`,rel:`noopener noreferrer`,className:`w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 font-bold font-outfit text-[#020c1b] bg-[#64ffda] hover:bg-[#64ffda]/90 rounded-lg shadow-[0_0_20px_rgba(100,255,218,0.3)] hover:shadow-[0_0_35px_rgba(100,255,218,0.5)] transition-all group duration-300 transform hover:scale-[1.03]`,children:[(0,E.jsx)(S,{className:`w-5 h-5 fill-current animate-pulse`}),(0,E.jsx)(`span`,{children:`PRESENTACIÓN`}),(0,E.jsx)(e,{className:`w-5 h-5 group-hover:translate-x-1 transition-transform`})]})})]})]})]}),(0,E.jsxs)(`section`,{id:`equipo`,className:`py-24 relative overflow-hidden`,children:[(0,E.jsx)(`div`,{className:`absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#64ffda]/5 blur-[100px] pointer-events-none`}),(0,E.jsxs)(`div`,{className:`max-w-7xl mx-auto px-6 relative z-10`,children:[(0,E.jsxs)(t.div,{initial:`hidden`,whileInView:`visible`,viewport:{once:!0},variants:c,className:`text-center mb-16`,children:[(0,E.jsx)(`h2`,{className:`text-3xl md:text-4xl font-bold text-[#e6f1ff] mb-4`,children:`Nuestro Equipo`}),(0,E.jsx)(`div`,{className:`w-20 h-1 bg-gradient-to-r from-blue-500 to-[#64ffda] mx-auto mb-6 rounded-full`}),(0,E.jsx)(`p`,{className:`text-lg max-w-2xl mx-auto`,children:`Especialistas de élite en auditoría de código y seguridad ofensiva para infraestructuras financieras críticas.`})]}),(0,E.jsxs)(t.div,{className:`grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto`,variants:u,initial:`hidden`,whileInView:`visible`,viewport:{once:!0},children:[(0,E.jsxs)(t.div,{variants:c,whileHover:{y:-12,scale:1.01},className:`group relative bg-[#112240]/70 backdrop-blur-md rounded-2xl overflow-hidden border border-[#64ffda]/15 hover:border-[#64ffda]/50 transition-all duration-400 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col`,children:[(0,E.jsx)(`div`,{className:`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#64ffda] to-blue-500`}),(0,E.jsx)(`div`,{className:`absolute top-0 right-0 w-32 h-32 bg-[#64ffda]/5 rounded-bl-[100px] -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-700 pointer-events-none`}),(0,E.jsxs)(`div`,{className:`h-44 bg-gradient-to-br from-[#0a192f] to-[#112240]/80 flex items-center justify-center relative overflow-hidden`,children:[(0,E.jsx)(`div`,{className:`absolute inset-0 opacity-10 bg-[linear-gradient(rgba(100,255,218,0.15)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(100,255,218,0.15)_1px,_transparent_1px)] bg-[size:20px_20px]`}),(0,E.jsx)(`div`,{className:`relative z-10 flex flex-col items-center`,children:(0,E.jsx)(`img`,{src:_,alt:`Leonel Rosso`,className:`foto-equipo w-24 h-24 rounded-full object-cover object-top border-2 border-[#64ffda]/40 group-hover:border-[#64ffda] shadow-[0_0_20px_rgba(100,255,218,0.1)] mb-3`})}),(0,E.jsx)(`div`,{className:`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#020c1b]/80 border border-[#64ffda]/30 rounded-full text-[10px] font-mono text-[#64ffda] uppercase tracking-widest whitespace-nowrap backdrop-blur-sm`,children:`Pentester & Auditor`})]}),(0,E.jsxs)(`div`,{className:`p-6 flex flex-col flex-grow gap-4 relative z-10`,children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`h4`,{className:`text-xl font-bold text-[#e6f1ff] mb-1`,children:`Leonel Rosso`}),(0,E.jsx)(`p`,{className:`text-sm text-[#64ffda] font-mono`,children:`Auditor de Código & Pentester`})]}),(0,E.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:[`Buffer Overflow`,`C/C++`,`GDB`,`Exploit Dev`].map(e=>(0,E.jsx)(`span`,{className:`text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a192f] border border-[#64ffda]/20 text-gray-400`,children:e},e))}),(0,E.jsx)(`p`,{className:`text-gray-400 text-sm leading-relaxed flex-grow`,children:`Especialista en análisis de vulnerabilidades de bajo nivel y pruebas de penetración orientadas a sistemas bancarios embebidos.`}),(0,E.jsxs)(`div`,{className:`flex items-center justify-between pt-3 border-t border-white/5`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-1.5 text-[10px] font-mono text-[#64ffda]/60`,children:[(0,E.jsx)(w,{className:`w-3.5 h-3.5`}),(0,E.jsx)(`span`,{children:`Sec. Ofensiva`})]}),(0,E.jsx)(`a`,{href:`https://github.com/leonelrosso`,target:`_blank`,rel:`noopener noreferrer`,className:`p-2 bg-[#0a192f] border border-[#64ffda]/20 rounded-full text-[#8892b0] hover:text-[#64ffda] hover:border-[#64ffda]/60 hover:bg-[#64ffda]/10 transition-all`,children:(0,E.jsx)(D,{className:`w-4 h-4`})})]})]})]}),(0,E.jsxs)(t.div,{variants:c,whileHover:{y:-12,scale:1.01},className:`group relative bg-[#112240]/70 backdrop-blur-md rounded-2xl overflow-hidden border border-blue-500/15 hover:border-blue-400/50 transition-all duration-400 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col`,children:[(0,E.jsx)(`div`,{className:`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400`}),(0,E.jsx)(`div`,{className:`absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -mr-4 -mt-4 group-hover:scale-150 transition-transform duration-700 pointer-events-none`}),(0,E.jsxs)(`div`,{className:`h-44 bg-gradient-to-br from-[#0a192f] to-[#112240]/80 flex items-center justify-center relative overflow-hidden`,children:[(0,E.jsx)(`div`,{className:`absolute inset-0 opacity-10 bg-[linear-gradient(rgba(59,130,246,0.2)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(59,130,246,0.2)_1px,_transparent_1px)] bg-[size:20px_20px]`}),(0,E.jsx)(`div`,{className:`relative z-10 flex flex-col items-center`,children:(0,E.jsx)(`div`,{className:`w-24 h-24 rounded-full bg-[#112240] border-2 border-blue-500/40 group-hover:border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] transition-all duration-300 flex items-center justify-center mb-3`,children:(0,E.jsx)(C,{className:`w-10 h-10 text-blue-400/70 group-hover:text-blue-400 transition-colors`})})}),(0,E.jsx)(`div`,{className:`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#020c1b]/80 border border-blue-500/30 rounded-full text-[10px] font-mono text-blue-400 uppercase tracking-widest whitespace-nowrap backdrop-blur-sm`,children:`Depuración & QA`})]}),(0,E.jsxs)(`div`,{className:`p-6 flex flex-col flex-grow gap-4 relative z-10`,children:[(0,E.jsxs)(`div`,{children:[(0,E.jsx)(`h4`,{className:`text-xl font-bold text-[#e6f1ff] mb-1`,children:`Juan Pablo Figueroa`}),(0,E.jsx)(`p`,{className:`text-sm text-blue-400 font-mono`,children:`Analista de Depuración & QA`})]}),(0,E.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:[`Cppcheck`,`GDB Debugger`,`QA Testing`,`C Seguro`].map(e=>(0,E.jsx)(`span`,{className:`text-[10px] font-mono px-2 py-0.5 rounded bg-[#0a192f] border border-blue-500/20 text-gray-400`,children:e},e))}),(0,E.jsx)(`p`,{className:`text-gray-400 text-sm leading-relaxed flex-grow`,children:`Especialista en análisis estático de código y depuración de memoria en sistemas de bajo nivel, asegurando la correcta mitigación de vulnerabilidades.`}),(0,E.jsxs)(`div`,{className:`flex items-center justify-between pt-3 border-t border-white/5`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-1.5 text-[10px] font-mono text-blue-400/60`,children:[(0,E.jsx)(s,{className:`w-3.5 h-3.5`}),(0,E.jsx)(`span`,{children:`Análisis Estático`})]}),(0,E.jsx)(`a`,{href:`https://github.com/juanpfigueroa`,target:`_blank`,rel:`noopener noreferrer`,className:`p-2 bg-[#0a192f] border border-blue-500/20 rounded-full text-[#8892b0] hover:text-blue-400 hover:border-blue-400/60 hover:bg-blue-500/10 transition-all`,children:(0,E.jsx)(D,{className:`w-4 h-4`})})]})]})]})]})]})]})]}),(0,E.jsxs)(`footer`,{className:`bg-[#0a192f] border-t border-[#64ffda]/10 py-10 z-10 relative overflow-hidden`,children:[(0,E.jsx)(`div`,{className:`absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-1 bg-gradient-to-r from-transparent via-[#64ffda] to-transparent opacity-30`}),(0,E.jsxs)(`div`,{className:`max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6`,children:[(0,E.jsxs)(`div`,{className:`flex items-center gap-2 bg-white/5 p-2 rounded-lg`,children:[(0,E.jsx)(`img`,{src:`./logo.png`,alt:`Overflow Labs Logo`,className:`w-auto h-8`}),(0,E.jsx)(`span`,{className:`font-bold text-[#e6f1ff] tracking-widest ml-2`,children:`OVERFLOW LABS`})]}),(0,E.jsx)(`p`,{className:`text-sm text-[#8892b0]`,children:`© 2026 Overflow Labs. Todos los derechos reservados.`})]})]})]})}(0,m.createRoot)(document.getElementById(`root`)).render((0,E.jsx)(p.StrictMode,{children:(0,E.jsx)(j,{})}));