const basicInfo = {
  definition: {
    openapi: "3.1.0", // present supported openapi version
    info: {
      title: "Ecommerce Api Documentary", // short title.
      description: "A interface for Ecommerce", //  desc.
      version: "1.0.0", // version number
      contact: {
        name: "Ecommerce", // your name
        email: "Ecommerce@gmail.com", // your email
        url: "localhost:3000", // your website
      },
    },
  },
  apis: ["./routes/*.js"],
};

export { basicInfo };
