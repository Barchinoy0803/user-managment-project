export const getTransformedTime = () => {
    const time = String(new Date()).split(" ").splice(0, 5).join(" ")
    
    return time
}