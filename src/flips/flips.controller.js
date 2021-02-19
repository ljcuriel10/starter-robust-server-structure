const flips = require("../data/flips-data");
const counts = require("../data/counts-data");


function list(req, res) {
    res.json({ data: flips });
}

function resultPropertyIsValid(req, res, next) {
    const { data: { result } = {} } = req.body;
    const validResult = ["heads", "tails", "edge"];
    if(validResult.includes(result)) {
        return next();
    }
    next({
        status: 400,
        message: `Value of the 'result' property must be one of ${validResult}. Received: ${result}`,
    })
}

function bodyHasResultProperty(req, res, next) {
    const { data: { result } = {} } = req.body;
    if (result) {
        return next();
    }
    next({
        status: 400,
        message: "A 'result' property is required.",
    })
}

function create(req, res) {
    const { data: { result } = {} } = req.body;
    const newFlip = {
        id: flips.length + 1,
        result,
    };
    flips.push(newFlip);
    counts[result] = counts[result] + 1;
    res.status(200).json({ data: newFlip });
}

function flipExists(req, res, next) {
    const { flipId } = req.params;
    const foundFlip = flips.find((flip) => flip.id === Number(flipId));
    if (foundFlip) {
      return next();
    }
    next({
      status: 404,
      message: `Flip id not found: ${flipId}`,
    });
  }
  
  function read(req, res) {
    const { flipId } = req.params;
    const foundFlip = flips.find((flip) => flip.id === Number(flipId));
    res.json({ data: foundFlip });
  }

  function update(req, res) {
    const { flipId } = req.params;
    const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  
    const originalResult = foundFlip.result;
    const { data: { result } = {} } = req.body;
  
    if (originalResult !== result) {
      // update the flip
      foundFlip.result = result;
      // Adjust the counts
      counts[originalResult] = counts[originalResult] - 1;
      counts[result] = counts[result] + 1;
    }
  
    res.json({ data: foundFlip });
  }

  function destroy(req, res) {
    const { flipId } = req.params;
    const index = flips.findIndex((flip) => flip.id === Number(flipId));
    // splice returns an array of the deleted elements, even if it is one element
    const deletedFlips = flips.splice(index, 1);
    deletedFlips.forEach(
      (deletedFlip) =>
        (counts[deletedFlip.result] = counts[deletedFlip.result] - 1)
    );
  
    res.sendStatus(204);
  }
  

module.exports = {
    create: [ bodyHasResultProperty, resultPropertyIsValid, create ],
    read: [flipExists, read],
    list,
    update: [flipExists, bodyHasResultProperty, resultPropertyIsValid, update],
    delete: [flipExists, destroy]
}