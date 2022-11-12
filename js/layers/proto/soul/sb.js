addLayer("p_s_sb", {
    name: "Soul Batteries",
    symbol: "SB",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    branches: ["p_s_sg", "p_s_sc", "p_s_mb"],
    color: "#FF0DFF",
    requires: new Decimal(10000),
    resource: "soul batteries",
    baseResource: "soul generators",
    baseAmount() { return player.p_s_sg.points },
    type: "normal",
    exponent: 0.5,
    gainMult() {  
        mult = new Decimal(1)
        if (hasUpgrade("p_s_sb", 13)) mult = mult.times(1.75)  
        if (hasUpgrade("p_s_sg", 25)) mult = mult.mul(upgradeEffect("p_s_sg", 25))   
        if (hasUpgrade("p_s_sb", 14)) mult = mult.mul(2)       
        if (hasUpgrade("p_s_sb", 15)) mult = mult.mul(upgradeEffect("p_s_sb", 15))         
        return mult               
    },
    gainExp() {    
        let base = new Decimal(1)
        if (player.p_s_mb.unlocked) base = base.mul(tmp.p_s_mb.effect)                         
        return base
    },
    doReset(x) {
        if (x == "p_s_sc") {
            layerDataReset(this.layer)
        } else if (x == "p_s_mb") {
            layerDataReset(this.layer)
        } else if (x === this.layer) {
            player.ygg.p_s_points = new Decimal(0)
        }
    },
    row: 1,
    layerShown() { return hasUpgrade("p_s_sg", 21) || hasMilestone("p_s_sb", 0) || player.p_s_sc.unlocked || player.p_s_mb.unlocked},
    upgrades: {
        11: {
            title: "Battery Power",
            description: "Soul generation scales with the amount of soul batteries you have.",
            cost: new Decimal(1),
            unlocked() { return hasUpgrade("p_s_sg", 23) || hasMilestone("p_s_sb", 0) },
            effect() {
                return player[this.layer].points.add(2).pow(0.6)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id))+ "x" },
        },
        12: {
            title: "Challenging",
            description: "Generators are slightly cheaper.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("p_s_sb", 11) },
        },
        13: {
            title: "Battery Bulk Buy",
            description: "Battery gain is largely increased.",
            cost: new Decimal(3),
            unlocked() { return hasUpgrade("p_s_sb", 12) },
        },
        14: {
            title: "Dual Charging",
            description: "Both Soul Generator and Battery gain is doubled.",
            cost: new Decimal(750),
            unlocked() {return hasUpgrade(this.layer, 13)}
        },
        15: {
            title: "Omnibatteries",
            description: "Your current Omnipoints increase Soul Battery gain.",
            cost: new Decimal(1500),
            unlocked() {return hasUpgrade(this.layer, 14) && hasAchievement("p_s_sg", 15)},
            effect() {
                let base = new Decimal(player.points)
                base = base.add(1).pow(0.25).log(15).add(1)
                return base.max(1)
            },
            effectDisplay() {return format(upgradeEffect(this.layer, this.id)) + "x"}
        }
    },
    milestones: {
        0: {
            requirementDescription: "1 battery",
            effectDescription: "Multiplies soul gain by 1.15.",
            done() { return player.p_s_sb.points.gte(1) }
        },
        1: {
            requirementDescription: "10 batteries",
            effectDescription: "Passively gain 10% of Soul Generator gain each second.",
            done() { return player.p_s_sb.points.gte(10) }
        },
        2: {
            requirementDescription: "2,500 batteries",
            effectDescription() {
                return "Increase Omnipoints gain based on Soul Batteries.<br>Currently: " + format(new Decimal(2).pow(player.p_s_sb.points.add(1).log(10).floor())) + "x" 
            },
            done() { return player.p_s_sb.points.gte(2500)}
        }
    }
})