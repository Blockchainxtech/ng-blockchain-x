



class Wallet<T,U>
{ 
    private key: T | undefined;
    private val: U | undefined;

    setKeyValue(key: T, val: U): void { 
        this.key = key;
        this.val = val;
    }

    display():void { 
        console.log(`Key = ${this.key}, val = ${this.val}`);
    }
}