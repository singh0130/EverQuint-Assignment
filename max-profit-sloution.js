function maxProfit(n) {
    const buildings = [
        { name: "T", build: 5, earn: 1500 },
        { name: "P", build: 4, earn: 1000 },
        { name: "C", build: 10, earn: 2000 }
    ];

    const memo = {};

    function dfs(timeLeft) {
        if (timeLeft <= 0) {
            return {
                profit: 0,
                mixes: new Set(["T: 0 P: 0 C: 0"])
            };
        }

        if (memo[timeLeft]) {
            return memo[timeLeft];
        }

        let bestProfit = 0;
        let bestMixes = new Set(["T: 0 P: 0 C: 0"]);

        for (let b of buildings) {
            if (timeLeft >= b.build) {
                let remaining = timeLeft - b.build;
                let currentProfit = remaining * b.earn;
                let next = dfs(remaining);
                let totalProfit = currentProfit + next.profit;

                if (totalProfit > bestProfit) {
                    bestProfit = totalProfit;
                    bestMixes = new Set();
                    for (let mix of next.mixes) {
                        bestMixes.add(incrementMix(mix, b.name));
                    }
                } else if (totalProfit === bestProfit && totalProfit > 0) {
                    for (let mix of next.mixes) {
                        bestMixes.add(incrementMix(mix, b.name));
                    }
                }
            }
        }

        const result = { profit: bestProfit, mixes: bestMixes };
        memo[timeLeft] = result;
        return result;
    }

    function incrementMix(mixStr, name) {
        const parts = mixStr.split(' ');
        let t = parseInt(parts[1]);
        let p = parseInt(parts[3]);
        let c = parseInt(parts[5]);
        if (name === 'T') t++;
        if (name === 'P') p++;
        if (name === 'C') c++;
        return `T: ${t} P: ${p} C: ${c}`;
    }

    const res = dfs(n);
    console.log(`Earnings: $${res.profit}`);
    if (res.profit > 0) {
        console.log("Solutions");
        let idx = 1;
        for (let sol of res.mixes) {
            console.log(`${idx++}. ${sol}`);
        }
    }
}

maxProfit(49);
