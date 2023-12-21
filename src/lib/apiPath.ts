const BASE_URL = "http://139.9.74.132:9898";
const pathList: Array<{ name: string; paths: Record<string, string>; baseUrl?: string }> = [
  {
    name: "file",
    paths: {
      upload: "/pdf/pdf-manager/uploadSmallFiles",
      toPDF: "/pdf/pdf-manager/workToPDF",
    },
  },
];
let obj: Record<string, any> = {};
pathList.forEach(i => {
  const base = i.baseUrl || BASE_URL;
  for (let key in i.paths) {
    if (i.paths.hasOwnProperty(key)) {
      i.paths[key] = base + i.paths[key];
    }
  }
  obj[i.name] = i.paths;
});

export default obj;
