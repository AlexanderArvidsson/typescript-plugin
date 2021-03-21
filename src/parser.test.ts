// prose prose-xl lg:prose-xl
// prose(& xl:& lg:xl)
// ring(&(&))
import { suite } from 'uvu'
import * as assert from 'uvu/assert'

import { parse } from './parser'

const test = suite('Parser')

/**
 * Get all rules
 */
;([
  ['', []],
  ['   \t \n\r ', []],
  [
    'focus:',
    [
      {
        raw: '',
        value: 'focus:',
        name: '',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 6, end: 6 },
        spans: [{ start: 0, end: 6 }],
        variants: [{ name: 'focus', raw: 'focus:', value: 'focus:', loc: { start: 0, end: 6 } }],
      },
    ],
  ],
  [
    'focus: ',
    [
      {
        raw: '',
        value: 'focus:',
        name: '',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 6, end: 6 },
        spans: [{ start: 0, end: 6 }],
        variants: [{ name: 'focus', raw: 'focus:', value: 'focus:', loc: { start: 0, end: 6 } }],
      },
    ],
  ],
  [
    'underline',
    [
      {
        raw: 'underline',
        value: 'underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 0, end: 9 },
        spans: [{ start: 0, end: 9 }],
        variants: [],
      },
    ],
  ],
  [
    'hover:underline',
    [
      {
        raw: 'underline',
        value: 'hover:underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 6, end: 15 },
        spans: [{ start: 0, end: 15 }],
        variants: [{ name: 'hover', raw: 'hover:', value: 'hover:', loc: { start: 0, end: 6 } }],
      },
    ],
  ],
  [
    '-mx-5!',
    [
      {
        raw: '-mx-5!',
        value: '-mx-5!',
        name: '-mx-5',
        prefix: '',
        important: true,
        negated: true,
        loc: { start: 0, end: 6 },
        spans: [{ start: 0, end: 6 }],
        variants: [],
      },
    ],
  ],
  [
    '-mx(5 sm:2! xl:8)',
    [
      {
        raw: '5',
        value: '-mx-5',
        name: '-mx-5',
        prefix: '-mx',
        important: false,
        negated: true,
        loc: { start: 4, end: 5 },
        spans: [
          { start: 0, end: 3 },
          { start: 4, end: 5 },
        ],
        variants: [],
      },
      {
        raw: '2!',
        value: 'sm:-mx-2!',
        name: '-mx-2',
        prefix: '-mx',
        important: true,
        negated: true,
        loc: { start: 9, end: 11 },
        spans: [
          { start: 0, end: 3 },
          { start: 6, end: 11 },
        ],
        variants: [
          {
            raw: 'sm:',
            value: 'sm:',
            name: 'sm',
            loc: { start: 6, end: 9 },
          },
        ],
      },
      {
        raw: '8',
        value: 'xl:-mx-8',
        name: '-mx-8',
        prefix: '-mx',
        important: false,
        negated: true,
        loc: { start: 15, end: 16 },
        spans: [
          { start: 0, end: 3 },
          { start: 12, end: 16 },
        ],
        variants: [
          {
            raw: 'xl:',
            value: 'xl:',
            name: 'xl',
            loc: { start: 12, end: 15 },
          },
        ],
      },
    ],
  ],
  [
    'ring(focus:& offset(& width)',
    [
      {
        raw: '&',
        value: 'focus:ring',
        name: 'ring',
        prefix: 'ring',
        important: false,
        negated: false,
        loc: { start: 11, end: 12 },
        spans: [
          { start: 0, end: 4 },
          { start: 5, end: 12 },
        ],
        variants: [
          {
            raw: 'focus:',
            value: 'focus:',
            name: 'focus',
            loc: { start: 5, end: 11 },
          },
        ],
      },
      {
        raw: '&',
        value: 'ring-offset',
        name: 'ring-offset',
        prefix: 'ring-offset',
        important: false,
        negated: false,
        loc: { start: 20, end: 21 },
        spans: [
          { start: 0, end: 4 },
          { start: 13, end: 19 },
          { start: 20, end: 21 },
        ],
        variants: [],
      },
      {
        raw: 'width',
        value: 'ring-offset-width',
        name: 'ring-offset-width',
        prefix: 'ring-offset',
        important: false,
        negated: false,
        loc: { start: 22, end: 27 },
        spans: [
          { start: 0, end: 4 },
          { start: 13, end: 19 },
          { start: 22, end: 27 },
        ],
        variants: [],
      },
    ],
  ],
  [
    'text(xl hover:underline) font-bold',
    [
      {
        raw: 'xl',
        value: 'text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 5, end: 7 },
        spans: [
          { start: 0, end: 4 },
          { start: 5, end: 7 },
        ],
        variants: [],
      },
      {
        raw: 'underline',
        value: 'hover:text-underline',
        name: 'text-underline',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 14, end: 23 },
        spans: [
          { start: 0, end: 4 },
          { start: 8, end: 23 },
        ],
        variants: [
          {
            raw: 'hover:',
            value: 'hover:',
            name: 'hover',
            loc: { start: 8, end: 14 },
          },
        ],
      },
      {
        raw: 'font-bold',
        value: 'font-bold',
        name: 'font-bold',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 25, end: 34 },
        spans: [{ start: 25, end: 34 }],
        variants: [],
      },
    ],
  ],
  [
    'top-[-123px] grid-cols-[minmax(100px,max-content)repeat(auto-fill,200px)20%] grid-rows-auto-1fr-auto bg-[#1da1f2]',
    [
      {
        raw: 'top-[-123px]',
        value: 'top-[-123px]',
        name: 'top-[-123px]',
        prefix: '',
        important: false,
        negated: false,
        loc: {
          start: 0,
          end: 12,
        },
        spans: [
          {
            start: 0,
            end: 12,
          },
        ],
        variants: [],
      },
      {
        raw: 'grid-cols-[minmax(100px,max-content)repeat(auto-fill,200px)20%]',
        value: 'grid-cols-[minmax(100px,max-content)repeat(auto-fill,200px)20%]',
        name: 'grid-cols-[minmax(100px,max-content)repeat(auto-fill,200px)20%]',
        prefix: '',
        important: false,
        negated: false,
        loc: {
          start: 13,
          end: 76,
        },
        spans: [
          {
            start: 13,
            end: 76,
          },
        ],
        variants: [],
      },
      {
        raw: 'grid-rows-auto-1fr-auto',
        value: 'grid-rows-auto-1fr-auto',
        name: 'grid-rows-auto-1fr-auto',
        prefix: '',
        important: false,
        negated: false,
        loc: {
          start: 77,
          end: 100,
        },
        spans: [
          {
            start: 77,
            end: 100,
          },
        ],
        variants: [],
      },
      {
        raw: 'bg-[#1da1f2]',
        value: 'bg-[#1da1f2]',
        name: 'bg-[#1da1f2]',
        prefix: '',
        important: false,
        negated: false,
        loc: {
          start: 101,
          end: 113,
        },
        spans: [
          {
            start: 101,
            end: 113,
          },
        ],
        variants: [],
      },
    ],
  ],
] as const).forEach(([input, expected]) => {
  test(`parse: ${JSON.stringify(input)}`, () => {
    // console.log(JSON.stringify(parse(input)))
    assert.equal(parse(input), expected)
  })
})

/**
 * Info at position use case
 */
;([
  [
    'underline',
    0,
    [
      {
        raw: 'underline',
        value: 'underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 0, end: 9 },
        spans: [{ start: 0, end: 9 }],
        variants: [],
      },
    ],
  ],
  [
    'underline',
    1,
    [
      {
        raw: 'underline',
        value: 'underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 0, end: 9 },
        spans: [{ start: 0, end: 9 }],
        variants: [],
      },
    ],
  ],
  [
    'underline',
    9,
    [
      {
        raw: 'underline',
        value: 'underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 0, end: 9 },
        spans: [{ start: 0, end: 9 }],
        variants: [],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    0,
    [
      {
        raw: 'underline',
        value: 'underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 0, end: 9 },
        spans: [{ start: 0, end: 9 }],
        variants: [],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    8,
    [
      {
        raw: 'underline',
        value: 'underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 0, end: 9 },
        spans: [{ start: 0, end: 9 }],
        variants: [],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    9,
    [
      {
        raw: 'underline',
        value: 'underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 0, end: 9 },
        spans: [{ start: 0, end: 9 }],
        variants: [],
      },
      {
        raw: 'lg',
        value: 'text-lg',
        name: 'text-lg',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 15, end: 17 },
        spans: [
          { start: 10, end: 14 },
          { start: 15, end: 17 },
        ],
        variants: [],
      },
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
      {
        raw: 'font-bold',
        value: 'font-bold',
        name: 'font-bold',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 25, end: 34 },
        spans: [{ start: 25, end: 34 }],
        variants: [],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    10,
    [
      {
        raw: 'lg',
        value: 'text-lg',
        name: 'text-lg',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 15, end: 17 },
        spans: [
          { start: 10, end: 14 },
          { start: 15, end: 17 },
        ],
        variants: [],
      },
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    13,
    [
      {
        raw: 'lg',
        value: 'text-lg',
        name: 'text-lg',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 15, end: 17 },
        spans: [
          { start: 10, end: 14 },
          { start: 15, end: 17 },
        ],
        variants: [],
      },
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    14,
    [
      {
        raw: 'lg',
        value: 'text-lg',
        name: 'text-lg',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 15, end: 17 },
        spans: [
          { start: 10, end: 14 },
          { start: 15, end: 17 },
        ],
        variants: [],
      },
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    15,
    [
      {
        raw: 'lg',
        value: 'text-lg',
        name: 'text-lg',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 15, end: 17 },
        spans: [
          { start: 10, end: 14 },
          { start: 15, end: 17 },
        ],
        variants: [],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    17,
    [
      {
        raw: 'lg',
        value: 'text-lg',
        name: 'text-lg',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 15, end: 17 },
        spans: [
          { start: 10, end: 14 },
          { start: 15, end: 17 },
        ],
        variants: [],
      },
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    18,
    [
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    20,
    [
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    21,
    [
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    23,
    [
      {
        raw: 'lg',
        value: 'text-lg',
        name: 'text-lg',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 15, end: 17 },
        spans: [
          { start: 10, end: 14 },
          { start: 15, end: 17 },
        ],
        variants: [],
      },
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
    ],
  ],
  [
    'underline text(lg md:xl) font-bold',
    24,
    [
      {
        raw: 'underline',
        value: 'underline',
        name: 'underline',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 0, end: 9 },
        spans: [{ start: 0, end: 9 }],
        variants: [],
      },
      {
        raw: 'lg',
        value: 'text-lg',
        name: 'text-lg',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 15, end: 17 },
        spans: [
          { start: 10, end: 14 },
          { start: 15, end: 17 },
        ],
        variants: [],
      },
      {
        raw: 'xl',
        value: 'md:text-xl',
        name: 'text-xl',
        prefix: 'text',
        important: false,
        negated: false,
        loc: { start: 21, end: 23 },
        spans: [
          { start: 10, end: 14 },
          { start: 18, end: 23 },
        ],
        variants: [
          {
            raw: 'md:',
            value: 'md:',
            name: 'md',
            loc: { start: 18, end: 21 },
          },
        ],
      },
      {
        raw: 'font-bold',
        value: 'font-bold',
        name: 'font-bold',
        prefix: '',
        important: false,
        negated: false,
        loc: { start: 25, end: 34 },
        spans: [{ start: 25, end: 34 }],
        variants: [],
      },
    ],
  ],
] as const).forEach(([input, position, expected]) => {
  test(`parse (position=${position}): ${JSON.stringify(input)}`, () => {
    assert.equal(parse(input, position), expected)
  })
})

/**
 * Completion at position use case
 */
;([
  [
    'underline',
    0,
    {
      raw: '',
      value: '',
      name: '',
      prefix: '',
      important: false,
      negated: false,
      loc: { start: 0, end: 0 },
      spans: [{ start: 0, end: 0 }],
      variants: [],
    },
  ],
  [
    'underline ',
    9,
    {
      raw: 'underline',
      value: 'underline',
      name: 'underline',
      prefix: '',
      important: false,
      negated: false,
      loc: { start: 0, end: 9 },
      spans: [{ start: 0, end: 9 }],
      variants: [],
    },
  ],
  [
    'underline ',
    10,
    {
      raw: '',
      value: '',
      name: '',
      prefix: '',
      important: false,
      negated: false,
      loc: { start: 10, end: 10 },
      spans: [{ start: 10, end: 10 }],
      variants: [],
    },
  ],
  [
    'underline \t\n',
    10,
    {
      raw: '',
      value: '',
      name: '',
      prefix: '',
      important: false,
      negated: false,
      loc: { start: 10, end: 10 },
      spans: [{ start: 10, end: 10 }],
      variants: [],
    },
  ],
  [
    'text( \t\n',
    6,
    {
      raw: '',
      value: 'text',
      name: 'text',
      prefix: 'text',
      important: false,
      negated: false,
      loc: { start: 6, end: 6 },
      spans: [
        { start: 0, end: 4 },
        { start: 6, end: 6 },
      ],
      variants: [],
    },
  ],
  [
    'mx-1 ',
    4,
    {
      raw: 'mx-1',
      value: 'mx-1',
      name: 'mx-1',
      prefix: '',
      important: false,
      negated: false,
      loc: { start: 0, end: 4 },
      spans: [{ start: 0, end: 4 }],
      variants: [],
    },
  ],
] as const).forEach(([input, position, expected]) => {
  test(`parse (position=${position}, exact): ${JSON.stringify(input)}`, () => {
    assert.equal(parse(input, position, true), expected)
  })
})

test.run()
