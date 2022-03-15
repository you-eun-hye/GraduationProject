const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
const TINY_FACE_DETECTOR = 'tiny_face_detector'


let selectedFaceDetector = SSD_MOBILENETV1

// tiny_face_detector options
let inputSize = 512 // 얼굴 인식 프레임 사이즈(파란색 네모)
let scoreThreshold = 0.5 // 점수 임계값, 커질수록 반응이 느려지는 대신 멀리있는 얼굴도 인식(?)

// 선택한 옵션별 필요한 변수
function getFaceDetectorOptions() {
  return selectedFaceDetector === SSD_MOBILENETV1
    ? new faceapi.SsdMobilenetv1Options({ minConfidence }) // SSD
    : new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold }) // Tiny
}

// tiny의 경우 프레임 사이즈 변경했을 떄
function onInputSizeChanged(e) {
  changeInputSize(e.target.value)
  updateResults()
}

// tiny의 경우 프레임 사이즈 변경했을 떄
function changeInputSize(size) {
  inputSize = parseInt(size)

  const inputSizeSelect = $('#inputSize')
  inputSizeSelect.val(inputSize)
  inputSizeSelect.material_select()
}

// tiny: scoreThreshold가 늘어날 때
function onIncreaseScoreThreshold() {
  scoreThreshold = Math.min(faceapi.utils.round(scoreThreshold + 0.1), 1.0)
  $('#scoreThreshold').val(scoreThreshold)
  updateResults()
}

// tiny: scoreThreshold가 줄어들 떄
function onDecreaseScoreThreshold() {
  scoreThreshold = Math.max(faceapi.utils.round(scoreThreshold - 0.1), 0.1)
  $('#scoreThreshold').val(scoreThreshold)
  updateResults()
}

// 선택한 거에 맞추어 faceapi 실행
function getCurrentFaceDetectionNet() {
  if (selectedFaceDetector === SSD_MOBILENETV1) {
    return faceapi.nets.ssdMobilenetv1
  }
  if (selectedFaceDetector === TINY_FACE_DETECTOR) {
    return faceapi.nets.tinyFaceDetector
  }
}

// 기다리기
function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params
}

// 감지할 대상이 바꼈을 경우
async function changeFaceDetector(detector) {
  ['#ssd_mobilenetv1_controls', '#tiny_face_detector_controls']
    .forEach(id => $(id).hide())

  selectedFaceDetector = detector
  const faceDetectorSelect = $('#selectFaceDetector')
  faceDetectorSelect.val(detector)
  faceDetectorSelect.material_select()

  $('#loader').show()
  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load('/')
  }

  $(`#${detector}_controls`).show()
  $('#loader').hide()
}

// 감지할 대상이 바꼈을 경우
async function onSelectedFaceDetectorChanged(e) {
  selectedFaceDetector = e.target.value

  await changeFaceDetector(e.target.value)
  updateResults()
}

// 감지할 대상이 바꼈을 경우 초기화
function initFaceDetectionControls() {
  const faceDetectorSelect = $('#selectFaceDetector')
  faceDetectorSelect.val(selectedFaceDetector)
  faceDetectorSelect.on('change', onSelectedFaceDetectorChanged)
  faceDetectorSelect.material_select()

  const inputSizeSelect = $('#inputSize')
  inputSizeSelect.val(inputSize)
  inputSizeSelect.on('change', onInputSizeChanged)
  inputSizeSelect.material_select()
}