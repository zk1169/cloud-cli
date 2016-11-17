export class MoneyTool {
    
    public static point2yuan(value: number): number {
        if (!value) {
            return value;
        }
        return value / 100;
    }
    public static yuan2point(value: number): number {
        if (!value) {
            return value;
        }
        return +(value * 100).toFixed();
    }

    public static add(arg1: number, arg2: number) {
        var r1: number, r2: number, m: number;
        try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
        try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m;
    }
    public static sub(arg1: number, arg2: number) {
        return this.add(arg1, -arg2);
    }

    public static mul(arg1: number, arg2: number) {
        var m: number = 0,
            s1: string = arg1.toString(),
            s2: string = arg2.toString();
        try { m += s1.split(".")[1].length } catch (e) {}
        try { m += s2.split(".")[1].length } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }

    public static div(arg1: number, arg2: number) {
        var t1: number = 0,
            t2: number = 0,
            r1: number, r2: number;
        try { t1 = arg1.toString().split(".")[1].length } catch (e) {}
        try { t2 = arg2.toString().split(".")[1].length } catch (e) {}
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    }
}