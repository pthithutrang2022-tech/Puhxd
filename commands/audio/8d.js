const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8d')
    .setDescription('Bật/Tắt hiệu ứng âm thanh 8D')
    .setDescriptionLocalizations({
      'vi': 'Bật/Tắt hiệu ứng âm thanh 8D',
    }),
  category: 'Audio',
  async execute(interaction) {
    const queue = interaction.client.distube.getQueue(interaction.guildId);

    if (!queue || !queue.playing) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription('❌ Không có bài hát nào đang phát!'),
        ],
        ephemeral: true,
      });
    }

    try {
      const has8D = queue.filters?.includes('8d');

      if (has8D) {
        queue.filters = queue.filters.filter(f => f !== '8d');
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Green')
              .setDescription('🔇 Đã tắt hiệu ứng 8D.'),
          ],
        });
      } else {
        if (!queue.filters) queue.filters = [];
        queue.filters.push('8d');
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Green')
              .setDescription('🔊 Đã bật hiệu ứng 8D.'),
          ],
        });
      }
    } catch (error) {
      console.error('Error in 8d command:', error);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription('❌ Đã xảy ra lỗi!'),
        ],
        ephemeral: true,
      });
    }
  },
};
