/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

const imageSizes = [
  {
    fname: "thumb/s",
    width: 320,
  },
  {
    fname: "thumb/m",
    width: 640,
  },
  {
    fname: "thumb/l",
    width: 1280,
  },
];

exports.myTrigger = async (event, context) => {
  if (event.name.includes("thumb/")) return;

  //bucket생성(storage생성)
  const bucket = new Storage().bucket(event.bucket);

  //event로 들어온 fileName 나누기
  const prefix = event.name.split("/origin/")[0];
  const postfix = event.name.split("/origin/")[1];

  const result = await Promise.all(
    imageSizes.map(
      (el) =>
        new Promise((resolve, reject) => {
          bucket
            .file(event.name)
            .createReadStream()
            .pipe(sharp().resize({ width: el.width }))
            .pipe(
              bucket
                .file(`${prefix}/${el.fname}/${postfix}`)
                .createWriteStream()
            )
            .on("finish", () => resolve("success"))
            .on("error", () => reject("failed"));
        })
    )
  );

  //   console.log("====result : ", result)
  //   console.log(`====event : ${JSON.stringify(event)}`)
};
