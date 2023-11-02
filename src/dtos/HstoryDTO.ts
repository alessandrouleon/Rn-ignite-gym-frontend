export interface HistoryDTO {
  id: string;
  name: string;
  group: string;
  hour: string;
  created_at: string;
}

export interface HistoryByBayDTO {
 title: string;
 data: HistoryDTO[];
}