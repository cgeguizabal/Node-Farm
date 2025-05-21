const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

////////////////////////////////
// FILE SYSTEM

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreateed on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File writen!");

////////////////////////////
// ASYNCHRONOUS FILE SYSTEM
// fs.readFile("./txt/startaefeat.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error! 💥", err);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         console.log("Your file has been written!");
//       });
//     });
//   });
// });

// console.log("Will read file!");

///////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

//Creating server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
      "my-own-header": "overview",
    });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
      "my-own-header": "product",
    });

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    //API page
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
      "my-own-header": "MY API",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
