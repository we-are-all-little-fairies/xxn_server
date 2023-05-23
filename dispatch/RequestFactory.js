const { RedRequester } = require("./choice/RedRequester");
const { HAHARequester } = require("./choice/HAHARequester");
const { OriginGPTRequester } = require("./choice/OriginGPTRequester");
const { AIPicsRequester } = require("./choice/AIPicsRequester");
QuestType = {
  RED: 1,
  HAHA: 2,
  ORIGIN: 3,
  AI_PICS: 4,
};
module.exports.QuestType = QuestType;

class RequestFactory {
  constructor(props) {
    this.props = props;
  }

  conductChoice() {
    let type = this.props;
    switch (type) {
      case QuestType.RED:
        return new RedRequester();
      case QuestType.HAHA:
        return new HAHARequester();
      case QuestType.ORIGIN:
        return new OriginGPTRequester();
      case QuestType.AI_PICS:
        return new AIPicsRequester();
    }
  }
}

module.exports.RequestFactory = RequestFactory;
