export default interface PathToLineToTagMap {
  [key: string]: {
    [key: number]: Set<string>;
  };
}
