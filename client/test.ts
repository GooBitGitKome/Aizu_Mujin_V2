function main(){
    const test: { [key: string]: Function } = {
        "a": tx
    };
    console.log(test['a']());
}
function tx(){
    return 'tx';
}

main();