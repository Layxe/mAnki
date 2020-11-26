let input   = document.getElementById('input')
let output  = document.getElementById('output')
let display = document.getElementById('display')
let copyInput = document.getElementById('copy-input')
let clipboardStatus = document.getElementById('clipboard-status')

// Auto complete
// #####################################################################################################################

$("#input").asuggest(suggestions, {
    'minChunkSize': 1,
    'delimiters': ' \n',
    'autoComplete': true,
    'stopSuggestionKeys': [$.asuggestKeys.RETURN],
    'cycleOnTab': true,
    'endingSymbols': ''
})

// Makro replacements
// #####################################################################################################################

let shortcuts = [
    ['<=>', '\\Leftrightarrow'],
    ['=>', '\\Rightarrow'],
    ['->', '\\to'],
    ['|N', '\\mathbb{N}'],
    ['|Z', '\\mathbb{Z}'],
    ['|R', '\\mathbb{R}'],
    ['|Q', '\\mathbb{Q}']
]

let replaceAllShortcuts = (code) => {

    shortcuts.forEach(shortcut => {
        code = replaceShortcut(code, shortcut)
        console.log(code)
    })

    input.value = code

    return code

}

let replaceShortcut = (code, shortcut) => {

    return code.replace(shortcut[0], shortcut[1])

} 

// Mathjax Rendering and clipboard
// #####################################################################################################################

let updateDisplay = () => {

    let code = input.value

    // Replace possible shortcuts
    code = replaceAllShortcuts(code)

    // Render the code
    display.innerHTML = `\\[${code}\\]`
    MathJax.typeset();
    output.innerHTML = `\\[${code}\\]`

    clipboardStatus.innerHTML = 
            `<span class="icon has-text-danger">
                <i class="fas fa-spinner fa-pulse"></i>
            </span>`
    
    // Write mathjax code into the clipboard and display the status
    navigator.clipboard.writeText(`\\[${code}\\]`)
        .catch((err) => {

            clipboardStatus.innerHTML = 
            `<span class="icon has-text-danger">
                <i class="fas fa-ban"></i>
            </span>`

        })
        .then((res) => {

            clipboardStatus.innerHTML = 
            `<span class="icon has-text-success">
                <i class="fas fa-check-square"></i>
            </span>`

        })

}

input.addEventListener('keyup', updateDisplay)