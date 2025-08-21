function main() {

    let letvariable = "let";
    const constvariable = "const";

    letvariable = "let2";

    const callback = () => {}

    let string = "string";
    let number = 134;
    let float = 1.3;
    let object = {};
    let array = [];
    let boolean = true || false;
    let pasticstring = `${string}`

    console.log("Hello, World!");
    console.error("error");
    console.warn("Warning")
    console.debug([boolean, pasticstring])

    console.log(callback)
    console.log(object)
    console.log(array)
    console.log(number)
    console.log(float)
}

main()