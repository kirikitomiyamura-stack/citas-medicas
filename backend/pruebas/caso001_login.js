const { Builder, By, until } = require("selenium-webdriver");
const path = require("path");

async function pruebaLogin() {

    let driver = await new Builder()
        .forBrowser("chrome")
        .build();

    try {


        const rutaLogin = path.resolve(
            __dirname,
            "../../frontend/pages/login.html"
        );

        await driver.get("file:///" + rutaLogin);

        
        await driver.findElement(By.id("correo"))
            .sendKeys("admin@citafacil.com");

       
        await driver.findElement(By.id("password"))
            .sendKeys("123456");

        
        await driver.findElement(By.id("btnLogin"))
            .click();

       
        await driver.wait(
            until.urlContains("dashboard.html"),
            10000
        );

       
        await driver.takeScreenshot()
            .then(function(imagen) {

                const fs = require("fs");

                fs.writeFileSync(
                    path.join(__dirname, "evidencia_caso001.png"),
                    imagen,
                    "base64"
                );

            });

        console.log("=================================");
        console.log("PRUEBA DE LOGIN");
        console.log("=================================");
        console.log("Resultado: APROBADO");
        console.log("El usuario ingresó correctamente al Dashboard.");
        console.log("Evidencia guardada como:");
        console.log("evidencia_caso001.png");

    } catch (error) {

        console.log("=================================");
        console.log("PRUEBA DE LOGIN");
        console.log("=================================");
        console.log("Resultado: RECHAZADO");
        console.log("La prueba no fue exitosa.");
        console.log(error);

    } finally {

        await driver.quit();

    }
}

pruebaLogin();