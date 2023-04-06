// export class SortData {
//   constructor(sort_by: Sortable, order: "asc" | "desc") {
//     sort_by = sort_by;
//     order = order;
//   }
//   sort_by: Sortable = "timestamp";
//   order: "asc" | "desc" = "desc";
//   compare(a: Reading, b: Reading) {
//     if (a[sort_by] > b[sort_by]) {
//       if (order == "desc") return -1;
//       else return 1;
//     } else if (a[sort_by] < a[sort_by]) {
//       if (order == "desc") return 1;
//       else return -1;
//     }
//     return 0;
//   }
//   public async sortData(data: Reading[]) {
//     console.log("hello from worker");
//     console.log(sort_by);
//     data.sort(compare);
//   }
// }
// Comlink.expose(SortData);

export function NosortData(data: Reading[], sort_by: Sortable, order: 'asc' | 'desc') {
  data.sort((a: Reading, b: Reading) => {
    if (a[sort_by] > b[sort_by]) {
      if (order === 'desc')
        return -1
      else return 1
    }
    else if (a[sort_by] < b[sort_by]) {
      if (order === 'desc')
        return 1
      else return -1
    }
    return 0
  })
}
