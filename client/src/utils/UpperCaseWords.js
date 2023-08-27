const UpperCaseWords = (name) => {
    let words = name.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    let result = words.join(" ");
    return result
}

export default UpperCaseWords