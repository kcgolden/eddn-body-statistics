function uniq(arr) {
    return arr.filter((item, index, self) => {
        return self.indexOf(item) === index;
    });
}
module.exports = uniq;