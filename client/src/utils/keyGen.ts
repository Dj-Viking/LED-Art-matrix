export function keyGen(): string {
  return (Math.random() * 10000).toString() + "something unique lol";
}