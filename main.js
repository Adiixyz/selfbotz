const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')

require('./adii.js')
nocache('./adii.js', module => console.log(`${module} is now updated!`))

const starts = async (adii = new WAConnection()) => {
    adii.logger.level = 'warn'
    console.log(banner.string)
    adii.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan bang'))
    })

    fs.existsSync('./Adii.json') && adii.loadAuthInfo('./Adii.json')
    adii.on('connecting', () => {
        start('2', 'Not connected...')
    })
    adii.on('open', () => {
        success('2', 'Connected to BOT WEA')
    })
    await adii.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./Adii.json', JSON.stringify(adii.base64EncodedAuthInfo(), null, '\t'))

    adii.on('chat-update', async (message) => {
        require('./adii.js')(adii, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
