const puppeteer = require("puppeteer");
const fs = require("fs");
const express = require('express');
const router = express.Router();
const Page = require("../model/Pagemodel");
const path = require("path");

const directory = path.join(__dirname, "../generated_files");
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
}

const savePageDataToDB = async (url, type, data, filePath) => {
    try {
        const page = new Page({
            url,
            type,
            data,
            filePath
        });
        await page.save();
        console.log(`${type} data and file path saved to database for ${url}`);
    } catch (error) {
        console.error(`Error saving ${type} data and file path to database for ${url}:`, error.message);
    }
};

router.post("/pdf", async (req, res) => {
    const { url } = req.body;
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { timeout: 30000 });
        const pdfBuffer = await page.pdf({ format: 'A4' });
        const fileName = `${new URL(url).hostname}.pdf`;
        const filePath = path.join(directory, fileName);
        await fs.writeFileSync(filePath, pdfBuffer);
        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.send("Pdf generated...");
        savePageDataToDB(url, 'pdf', pdfBuffer, filePath);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Error generating PDF');
    }
});

router.post("/screenshot", async (req, res) => {
    const { url } = req.body;
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { timeout: 30000 });
        const sanitizedUrl = url.replace(/[^a-z0-9]/gi, '');
  
        const screenshotBuffer = await page.screenshot({ fullPage: true });
        const screenshotPath = `./generated_files/${sanitizedUrl}.png`;
        fs.writeFileSync(screenshotPath, screenshotBuffer);

        await browser.close();
        const filePath = screenshotPath;

        res.setHeader('Content-Type', 'image/png');
        res.send("Screenshot captured...");
        savePageDataToDB(url, 'screenshot', screenshotBuffer, filePath);
    } catch (error) {
        console.error('Error generating screenshot:', error);
        res.status(500).send('Error generating screenshot');
    }
});


router.post("/html", async (req, res) => {
    const { url } = req.body;
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { timeout: 30000 });
        const htmlContent = await page.content();
        const fileName = `${new URL(url).hostname}.html`;
        const filePath = path.join(directory, fileName);
        await fs.writeFileSync(filePath, htmlContent);
        await browser.close();
        res.setHeader('Content-Type', 'text/html');
        res.send("html generated");
        savePageDataToDB(url, 'html', htmlContent, filePath);
    } catch (error) {
        console.error('Error generating HTML:', error);
        res.status(500).send('Error generating HTML');
    }
});

router.get('/data', async (req, res) => {
    try {
        const data = await Page.find({});
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

module.exports = router;
