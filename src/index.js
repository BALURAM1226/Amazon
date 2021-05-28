const cors = require("cors");
const express = require("express");
const stripe = require("stripe")("sk_test_51ItAJ3SCvcRdNxPbdzp8Rp90PwPjubF3oKWUeiidmlWO3UuIz8Oecl1S8AMtPrSyaRY8OrktyfZ4kQ1rJScE4E7700mrWFi2vd");
const uuid = require("uuid/v4");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());



app.get("/", (req, res) => {
  res.send("Server is working fine !");
});

app.post("/checkout", async (req, res) => {
  console.log("Request:", req.body);

  let error;
  let status;
  try {
    const { product, token } = req.body;

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });

    const idempotency_key = uuid();
    const charge = await stripe.charges.create(
      {
        amount: product.price * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchased the ${product.name}`,
        shipping: {
          name: token.card.name,
          address: {
            line1: token.card.address_line1,
            line2: token.card.address_line2,
            city: token.card.address_city,
            country: token.card.address_country,
            postal_code: token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});

app.listen(PORT);
