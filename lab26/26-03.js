const fs = require('fs').promises;

async function runWasm() {
    try {
        // Читаем WASM файл
        const wasmBuffer = await fs.readFile('math.wasm');

        // Компилируем и инстанцируем модуль
        const module = await WebAssembly.compile(wasmBuffer);
        const instance = await WebAssembly.instantiate(module);

        // Используем функции
        const { sum, sub, mul } = instance.exports;

        console.log('WASM functions test:');
        console.log(`sum(5, 3) = ${sum(5, 3)}`);
        console.log(`sub(5, 3) = ${sub(5, 3)}`);
        console.log(`mul(5, 3) = ${mul(5, 3)}`);
    } catch (err) {
        console.error('Error:', err);
    }
}

runWasm();