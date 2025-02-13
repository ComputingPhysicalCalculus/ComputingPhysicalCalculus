/**
 * @file TestingUtils.ts
 * @description This file contains the utility functions for testing
 * @author Simon Solca
*/

/**
 * @function binary_search
 * @description finds the x value s.t. F(x) is close to goal
 * @return x value
 * @author Simon Solca
*/
export function binary_search(F: (v :number) => number, low: number, high: number, goal:number, epsilon = 0.001){
    while (high - low > epsilon){
        let mid = (low + high) / 2;
        let v = F(mid);

        if (Math.abs(v - goal) < epsilon){
            return mid;
        }
        else if (v < goal){
            low = mid;
        }
        else{
            high = mid;
        }
    }
    return (low + high) / 2;
}

/**
 * @function PPMC
 * @description calculates the Pearsons Product Moment Corellation Coefficient
 * @return returns this r value
 * @author Simon Solca
*/
export function PPMC(x: number[], y: number[]){
    let n = x.length;
    let xbar = x.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / n;
    let ybar = y.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / n;
    let numerator = 0
    for (let i = 0; i < x.length; i++){
        numerator += (x[i] - xbar) * (y[i] - ybar);
    }
    let denominator_lhs = 0;
    let denominator_rhs = 0;
    for (let i = 0; i < x.length; i++){
        denominator_lhs += (x[i] - xbar) * (x[i] - xbar);
        denominator_rhs += (y[i] - ybar) * (y[i] - ybar);
    }
    return numerator / Math.sqrt(denominator_lhs * denominator_rhs);
}

export function MSE(x: number[], y: number[]){
    let n = x.length;
    let sum = 0;
    for (let i = 0; i < n; i++){
        let d = (y[i] - x[i]);
        sum += d * d;
    }
    return sum / n;
}