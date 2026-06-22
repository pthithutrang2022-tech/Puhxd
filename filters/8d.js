module.exports = {
  name: '8d',
  description: 'Apply 8D stereo audio effect',
  category: 'Audio Filter',
  apply: (ffmpegArgs) => {
    // 8D Audio Filter: Creates a rotating stereo effect
    const audioFilter = `apulsator=hz=0.5:triangleramp=1:amount=0.9[8d_out]`;
    return [...ffmpegArgs, '-af', audioFilter];
  },
  removable: true,
};
