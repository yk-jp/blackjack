export default interface IPlayer {
  name: string;
  gameType: string;
  hand: TCard[];
  status: string;
  action: string;
  winAmount: number;
  type: string;
  bet: number;
  chip: number;
}
