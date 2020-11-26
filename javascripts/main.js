let input   = document.getElementById('input')
let output  = document.getElementById('output')
let display = document.getElementById('display')
let copyInput = document.getElementById('copy-input')
let clipboardStatus = document.getElementById('clipboard-status')

let updateTimer = setTimeout(() => {}, 0)
let finishedLoading = false;

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
    ['<=', '\\Leftarrow'],
    ['->', '\\to'],
    ['|N', '\\mathbb{N}'],
    ['|Z', '\\mathbb{Z}'],
    ['|R', '\\mathbb{R}'],
    ['|Q', '\\mathbb{Q}'],
    ['|C', '\\mathbb{C}'],
    ['OO', '\\infty'],
    ['&&', '\\wedge'],
    ['||', '\\vee']
]

let replaceAllShortcuts = (code) => {

    shortcuts.forEach(shortcut => {
        code = replaceShortcut(code, shortcut)
        console.log(code)
    })

    // Remove the blank to recognize the shortcuts
    input.value = code.substring(1)

    return code

}

let replaceShortcut = (code, shortcut) => {

    return code.replace(' ' + shortcut[0] + ' ', ' ' + shortcut[1] + ' ')

} 

// Mathjax Rendering and clipboard
// #####################################################################################################################

let updateDisplay = () => {

    // Display loading icon
    if (finishedLoading)
        clipboardStatus.innerHTML = 
                `<span class="icon has-text-danger">
                    <i class="fas fa-spinner fa-pulse"></i>
                </span>`

    finishedLoading = false

    clearTimeout(updateTimer)

    updateTimer = setTimeout(() => {

        let code = input.value

        // Add a space to the beginning so shortcuts will be recognized, because
        // they need a blank before and after the string
        code = ' ' + input.value

        // Replace possible shortcuts, if the text is finished
        code = replaceAllShortcuts(code)

        // Render the code
        display.innerHTML = `\\[${code}\\]`
        MathJax.typeset();
        output.innerHTML = `\\[${code}\\]`

        // Write mathjax code into the clipboard and display the status
        navigator.clipboard.writeText(`\\[${code}\\]`)
            .catch((err) => {

                clipboardStatus.innerHTML = 
                `<span class="icon has-text-danger">
                    <i class="fas fa-ban"></i>
                </span>`

                finishedLoading = true

            })
            .then((res) => {

                clipboardStatus.innerHTML = 
                `<span class="icon has-text-success">
                    <i class="fas fa-check-square"></i>
                </span>`

                finishedLoading = true

            })
    }, 500)
}

input.addEventListener('keyup', updateDisplay)