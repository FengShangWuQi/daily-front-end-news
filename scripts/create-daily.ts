import { join } from "path";
import { outputFile, pathExists } from "fs-extra";
import { format, add } from "date-fns";
import { logger } from "@fengshangwuqi/logger";

const DAILY_ITEM_NUM = 4;

const getFileName = (date?: Date) => {
  const daily = format(date || new Date(), "yyyy/MM/dd");

  return `${daily}.md`;
};

const getFilePath = (date?: Date) => {
  const fileName = getFileName(date);

  return join(process.cwd(), fileName);
};

(async () => {
  let date = new Date();
  const isDailyExists = await pathExists(getFilePath());
  let days = isDailyExists ? 1 : 0;

  while (days) {
    date = add(date, { days });
    const isNewDailyExists = await pathExists(getFilePath(date));

    days = isNewDailyExists ? days++ : 0;
  }

  const fileName = getFileName(date);
  const filePath = getFilePath(date);

  const title = "> # daily-front-end-news";
  const content = Array.from({ length: DAILY_ITEM_NUM }, () => "- []()：；");

  await outputFile(filePath, [title, ...content].join("\n".repeat(2)));

  logger(`create daily: ${fileName}`).withLevel("SUCCESS");
})();
