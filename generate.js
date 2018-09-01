module.exports.text = state => {
  let type = 'фильм'

  if (state.cartoon !== 'false') {
    type = 'мультик'

    if (state.cartoon === 'Аниме') type = 'аниме'
    if (state.cartoon === 'Пластилин') type = 'пластилиновый мультик'
  }

  if (state.musical !== 'false') {
    if (state.cartoon !== 'false') {
      type += '-мюзикл'
    } else {
      type = 'мюзикл'
    }
  }

  const ending = state.gender === 'false' ? 'ом' : 'ой'

  let text = `Я снял ${type} ${state.color === 'true' || state.cripple === 'Слепота' ? 'о' : 'об'}${state.cripple === 'Слепота' ? ` слеп${ending}` : ''}${state.cripple === 'Уродства' ? ` уродлив${ending} ` : ' '}`

  /**
   * Пол и цвет
   */
  if (state.color === 'true') {
    if (state.gender === 'false') {
      text += 'гее-негре'
    }

    if (state.gender === 'true') {
      if (state.cripple === 'Феминизм') {
        text += 'негр_есске'
      } else {
        text += 'негритянке'
      }
    }
  } else {
    if (state.gender === 'false') {
      text += 'индусе-гее'
    }

    if (state.gender === 'true') {
      if (state.cripple === 'Феминизм') {
        text += 'индус_ске'
      } else {
        text += 'индуске'
      }
    }
  }

  /**
   * Особенности
   */
  if (state.gender === 'false' && state.cripple === 'Феминизм') {
    text += '-феминистке'
  }

  if (state.cripple !== 'false') {
    if (state.cripple === 'false') {
      text += '-инвалиде'
    }

    if (state.cripple === 'Аутизм') {
      if (state.gender === 'false') {
        text += '-аутисте'
      } else {
        text += '-аутистке'
      }
    }

    if (state.cripple === 'Синдром дауна') {
      text += ' с синдромом дауна'
    }

    if (state.cripple === 'Шизофрения') {
      text += ' с шизофренией'
    }

    if (state.cripple === 'Колясочник (+ ДЦП)') {
      if (state.gender === 'false') {
        text += '-колясочнике'
      } else {
        text += '-колясочнице'
      }
    }
  }

  if (state.animal !== 'false') {
    text += ' с животным'
  }

  if (state.fatal !== 'false') {
    if (state.gender === 'true') {
      text += ', переживающем '
    } else {
      text += ', переживающей '
    }

    text += 'смертельную болезнь'
  }

  if (state.religion !== 'false') {
    text += ', затронул религию'
  }

  const modificators = {}

  if (state.poorness !== 'false') modificators.poorness = true
  if (state.slavery !== 'false') modificators.slavery = true

  const modificatorsLength = Object.keys(modificators).length

  if (state.poorness !== 'false') {
    text += ', показал бедность'
  }

  if (state.slavery !== 'false') {
    if (modificatorsLength === 1) {
      text += ', показал рабство'
    } else {
      text += ' и рабство'
    }
  }

  /**
   * Окончание
   */
  text += shuffle([
    ` и получил оскар, а ты так можешь?`,
    '. Вся суть этой премии.',
    '. Я самый толерантный режиссёр!'
  ])[0];

  return text
}

module.exports.emoji = state => {
  const stack = []
  /*
    Основные категории
  */
  state.cripple !== 'false' && stack.push('crying_cat_face')
  state.animal !== 'false' && stack.push('tiger')
  state.slavery !== 'false' && stack.push('statue_of_liberty')
  state.poorness !== 'false' && stack.push('ru')
  state.fatal !== 'false' && stack.push('soccer')
  state.religion !== 'false' && stack.push('book')
  state.cartoon !== 'false' && stack.push('dog')
  state.musical !== 'false' && stack.push('speaker')

  /*
    Если не хватает
  */
  if (state.color === 'true') {
    if (state.gender === 'false') {
      stack.push('man_3')
    } else {
      stack.push('woman_3')
    }
  } else {
    if (state.gender === 'false') {
      stack.push('man_with_turban_1')
    } else {
      stack.push('woman-wearing-turban_1')
    }
  }

  return shuffle(stack.slice(0, 3))
}

const shuffle = arr => (
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1])
)
