var express = require("express");
app = express();

const vault = require("node-vault")({
  apiVersion: "v1",
  endpoint: "https://vault.apps.sno.homelab.io",
  requestOptions: {
      strictSSL: false
    }
});

const roleId = process.env.ROLE_ID;
const secretId = process.env.SECRET_ID;

// Function to authenticate with Vault and set the token
async function authenticateWithVault() {
  try {
    const result = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });

    vault.token = result.auth.client_token; // Set token for subsequent Vault requests
    console.log(`Vault authentication successful. Token: ${vault.token}`);
  } catch (error) {
    console.error("Vault authentication failed:", error);
    throw error;
  }
}

let podIP = process.env?.POD_NAME || "Unkown";

app.get("/", async function (req, res) {
  try{
  const { data } = await vault.read("secrets/data/nodejs/webapp"); // Retrieve the secret stored in pr
  res.send(`Hello World from pod: ${podIP}.The message is ${data.data.message}`);
  }
  catch(error) {
    console.log(error.response.body.errors)
    console.log(`RoleId = ${roleId} and secretId = ${secretId}`)
    res.send(`Error occured, ${error.response.body.errors}`);
  }
});

app.get("/hello", function (req, res) {
  res.send("Hello World...");
});

app.listen(8080, async () => {
  console.log("Example app listening on port 8080!");
  try {
    await authenticateWithVault(); // Perform initial Vault authentication on app start
  } catch (error) {
    console.error("Vault authentication failed during startup:", error);
    process.exit(1); // Exit the app if authentication fails during startup
  }
});
