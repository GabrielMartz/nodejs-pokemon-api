# PokeAPI

API REST básica de Pokémon construida con Node.js nativo (módulo `http`), sin frameworks externos.

## Requisitos

- Node.js >= 18 (por el uso de `--watch`)

## Instalación y uso

```bash
# Iniciar servidor en modo desarrollo (con hot-reload)
npm run dev

# O iniciar manualmente
node pokeapi.mjs
```

El servidor corre en `http://localhost:3000`.

## Endpoints

### GET /

Devuelve un mensaje de bienvenida.

**Respuesta:**
```json
{ "message": "Welcome to the PokeAPI" }
```

---

### GET /pokemons

Devuelve la lista completa de Pokémon.

**Respuesta:** Array de objetos Pokémon.

---

### GET /pokemons?name={nombre}

Busca un Pokémon por su nombre (coincidencia exacta, sin distinguir mayúsculas/minúsculas en el código pero sensible en la query).

**Ejemplo:**
```
GET /pokemons?name=Bulbasaur
```

**Respuesta exitosa (200):** Objeto Pokémon.
**Respuesta error (400):** `Not Found 400 - pokemon not found - bad request`

---

### GET /pokemons?type={tipo}

Filtra Pokémon por tipo. El tipo se busca dentro del array `tipo` de cada Pokémon.

**Ejemplo:**
```
GET /pokemons?type=Planta
```

**Respuesta (200):** Array de Pokémon que coinciden con el tipo (puede ser vacío).

---

### POST /pokemons

Crea un nuevo Pokémon.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "id": 143,
  "nombre": "Snorlax",
  "tipo": ["Normal"],
  "nivel": 38,
  "hp": 320
}
```

**Campos requeridos:** `nombre`, `tipo`, `nivel`, `hp`.

**Respuesta exitosa (201):**
```json
{ "message": "Pokemon created successfully", "pokemon": { ... } }
```

**Errores:**
- `400` - `Missing required fields`
- `400` - `Pokemon already exists`
- `400` - `Invalid JSON`

---

### PUT /pokemons/update

Actualiza un Pokémon existente. Se busca por el campo `nombre` en el body.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "id": 143,
  "nombre": "Snorlax",
  "tipo": ["Normal"],
  "nivel": 40,
  "hp": 350
}
```

**Respuesta exitosa (200):**
```json
{ "message": "Pokemon updated successfully", "pokemon": { ... } }
```

**Errores:**
- `404` - `Pokemon not found`
- `400` - `Invalid JSON`
- `500` - `Could not save file`

---

### DELETE /pokemons?id={id}

Elimina un Pokémon por su `id`.

**Ejemplo:**
```
DELETE /pokemons?id=143
```

**Respuesta exitosa (200):**
```json
{ "message": "Pokemon deleted successfully" }
```

**Errores:**
- `404` - `Pokemon not found`
- `500` - `Could not save file`

---

### DELETE /pokemons?name={nombre}

Elimina un Pokémon por su `nombre`.

**Respuesta exitosa (200):**
```json
{ "message": "Pokemon deleted successfully" }
```

---

## Estructura del objeto Pokémon

```json
{
  "id": 1,
  "nombre": "Bulbasaur",
  "tipo": ["Planta", "Veneno"],
  "nivel": 12,
  "hp": 45
}
```

| Campo    | Tipo           | Descripción                |
|----------|----------------|----------------------------|
| `id`     | number         | Identificador único        |
| `nombre` | string         | Nombre del Pokémon         |
| `tipo`   | string[]       | Array de tipos             |
| `nivel`  | number         | Nivel del Pokémon          |
| `hp`     | number         | Puntos de salud            |

## Pokémon disponibles

| ID  | Nombre     | Tipo(s)               | Nivel | HP  |
|-----|------------|-----------------------|-------|-----|
| 1   | Bulbasaur  | Planta, Veneno        | 12    | 45  |
| 4   | Charmander | Fuego                 | 15    | 39  |
| 7   | Squirtle   | Agua                  | 13    | 44  |
| 25  | Pikachu    | Eléctrico             | 20    | 60  |
| 133 | Eevee      | Normal                | 18    | 55  |
| 448 | Lucario    | Lucha, Acero          | 42    | 135 |

## Persistencia

Los datos se almacenan en `./pokemons/pokemons.json`. Las operaciones POST, PUT y DELETE escriben los cambios directamente en ese archivo.
