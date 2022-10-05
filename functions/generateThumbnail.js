/**
 * Triggered from a change to a Cloud Storage bucket.
 *
 * @param {!Object} event Event payload.
 * @param {!Object} context Metadata for the event.
 */
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

//Storage를 이용하여 내가 생성한 bucket을 가져온다.
const bucket = new Storage().bucket("codecamp-storage-annie");

//s, m, l에 따라 각기 다른 width를 먼저 각 사이즈 별로 객체에 넣어주고, 해당 객체를 배열에 넣어주었다.
//map을 사용하면 Promise.all()로 동시에 이미지 저장을 할 때 조금 더 손쉽게 내부에 접근이 가능하며 간단하다.
const imageSizes = [
  //s사이즈의 size, width(너비) 데이터
  {
    size: "s",
    width: 320,
  },
  //m사이즈의 size, width(너비) 데이터
  {
    size: "m",
    width: 640,
  },
  {
    //L사이즈의 size, width(너비) 데이터
    size: "l",
    width: 1280,
  },
];

//Google Cloud의 진입점으로 잡아준 myTrigger 함수이다. Promise를 사용하기 위하여 async로 선언해주었다.
exports.myTrigger = async (event, context) => {
  //우리가 등록한 정보가 event에 들어온다.
  //썸네일 이미지가 버킷에 추가될 경우 트리거로 인하여 계속 함수가 수행된다. 따라서 종료조건을 넣어주지 않으면 'thumb/img1.jpg', 'thumb/thumb/img1.jpg' ...와 같이 계속 반복적으로 버킷에 저장된다.
  //한 번 해당 이미지를 thumb/폴더에 저장하고 다시 실행된 트리거에서는 'thumb/img1.jpg'이름으로 event가 들어오는데, 이때 파일 명 내에 thumb/가 있는지 includes로 확인하여 존재한다면 return으로 반복을 종료해주었다.
  if (event.name.includes("thumb/")) return;

  //만약 아직 저장되지 않은 파일이라면 트리거로 들어온 event객체 안의 name값에 들어있는 파일명을 fileName 변수에 저장한다.
  const fileName = event.name;

  //요청으로 들어온 n개의 이미지 파일을 각각 동시에 처리해주어 효율성을 높이기 위해서 Promise.all()을 사용하였다.
  //Promise.all에 await를 해주면 요청된 이미지 갯수만큼 동시에 실행되지만 모두가 끝나야 다음 줄이 수행된다.
  const result = await Promise.all(
    imageSizes.map(
      //map을 사용하여 위에서 정의해준 imageSizes에 접근한다.
      (el) =>
        new Promise((resolve, reject) => {
          //resolve : 성공 시, reject : 실패 시
          bucket //위에서 정의해준 나의 버킷
            .file(fileName) //파일명이 fileName인 파일을 버킷에서 가져온다.
            .createReadStream() //createReadStream()으로 위에서 가져온 파일을 읽어들인다.
            //읽어들인 파일을 pipe()에 넣어주고 해당 파일에게 수행해야할 것을 pipe()내부에 적어준다.
            .pipe(sharp().resize({ width: el.width })) //sharp라이브러리를 사용하여 resize()를 통해 map으로 가져온 데이터(el)에서 내가 원하는 width(map)를 resize에 넣어준다. width만 지정해주면 자동으로 높이가 비율에 맞게 auto-scaled 된다.
            .pipe(
              //sharp라이브러리로 크기가 조절된 파일을 pipe안에 넣고 위에서 지정해준 나의 버킷에 저장한다.
              bucket.file(`thumb/${el.size}/${fileName}`).createWriteStream() //file() 함수 인자로 지정해준 파일명을 가진 이미지 파일을 버킷 storage에 저장한다.
            )
            .on("finish", () => resolve("success")) //성공 시 resolve()가 수행되어 result배열에  "success" 문구가 저장된다.
            .on("error", () => reject("failed")); //실패 시 reject()가  수행되어 result배열에 "failed" 문구가 저장된다.
        })
    )
  );

  //   console.log("====result : ", result)
  //   console.log(`====event : ${JSON.stringify(event)}`)
};
