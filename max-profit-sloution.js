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
                counts: { T:0, P:0, C:0 }
            };
        }

        if (memo[timeLeft]) {
            return memo[timeLeft];
        }

        let best = {
            profit: 0,
            counts: { T:0, P:0, C:0 }
        };

        for (let building of buildings) {

            if (timeLeft >= building.build) {

                let remaining =
                    timeLeft - building.build;

                let currentProfit =
                    remaining * building.earn;

                let next =
                    dfs(remaining);

                let totalProfit =
                    currentProfit +
                    next.profit;

                if (
                    totalProfit >
                    best.profit
                ) {

                    let newCounts = {
                        ...next.counts
                    };

                    newCounts[
                        building.name
                    ]++;

                    best = {
                        profit: totalProfit,
                        counts: newCounts
                    };
                }
            }
        }

        memo[timeLeft] = best;

        return best;
    }

    return dfs(n);
}
