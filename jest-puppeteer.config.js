module.exports = {
    launch: {
        // Disable headless mode
        headless: false,
        // Pass the options to install the extension
        args: [
            `--disable-extensions-except=${__dirname}`,
            `--load-extension=${__dirname}`,
            `--window-size=800,600`
        ]
    },
}