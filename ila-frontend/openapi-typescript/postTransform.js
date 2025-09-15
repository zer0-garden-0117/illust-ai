import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// __dirname の代替処理
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ファイルパスを設定
const filePath = path.resolve(__dirname, "../src/generated/services/ila-v1.d.ts");

try {
  // TypeScript定義ファイルを読み込み
  let fileContent = fs.readFileSync(filePath, "utf8");

  // 型定義の修正
  // titleImage: string; -> titleImage: File;
  fileContent = fileContent.replace(/coverImage: string;/g, "coverImage: File;");

  // images: string[]; -> images: File[];
  fileContent = fileContent.replace(/profileImage: string;/g, "profileImage: File;");

  // 修正後のファイルを再度書き込み
  fs.writeFileSync(filePath, fileContent, "utf8");

} catch (error) {
  console.error("Error during post-transform:", error);
}