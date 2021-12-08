export const getRequestCandidates = (message: string): string[] => [
  message,
  ...(message.match(/"[^"\s]+?"/g) ?? []).map((s) => s.slice(1, -1)),
];
