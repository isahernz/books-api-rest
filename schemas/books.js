const z = require("zod");

// Validation Zod Schema
const bookSchema = z.object({
  author: z.string({
    invalid_type_error: "Author book must be string",
  }),
  genre: z.array(
    z.enum([
      "Amor",
      "Aventura",
      "Ciencia Ficción",
      "Comedia",
      "Drama",
      "Fantasía",
      "Histórico",
      "Horror",
      "Juvenil",
      "Autoayuda",
      "Motivacional",
      "Romance",
      "Desarrollo Personal",
      "Cuento",
      "Poesía",
    ]),
    {
      required_error: "Book genre is required.",
      invalid_type_error: "Book genre must be an array of enum Genre",
    }
  ),
  image: z.string().url(),
  language: z.array(
    z.enum(
      ["Español", "Inglés", "Francés", "Alemán", "Italiano", "Portugués"],
      {
        required_error: "Book languague is required.",
        invalid_type_error: "Book languague must be an array of enum Languague",
      }
    )
  ),
  summary: z.string({
    invalid_type_error: "Summary book must be string",
  }),
  title: z.string({
    required_error: "Title book is required",
    invalid_type_error: "Title book must be string",
  }),
  year_published: z.number().int().min(1900),
});

function validateBook(input) {
  return bookSchema.safeParse(input);
}

function validatePartialBook(input) {
  return bookSchema.partial().safeParse(input);
}

module.exports = {
  validateBook,
  validatePartialBook,
};
