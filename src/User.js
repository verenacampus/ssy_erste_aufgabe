class User {
    constructor(name, legs, color, friends) {
        this.name = name;
        this.legs = legs;
        this.color = color;
        this.friends = friends ?? [];
    }
}

module.exports = User;