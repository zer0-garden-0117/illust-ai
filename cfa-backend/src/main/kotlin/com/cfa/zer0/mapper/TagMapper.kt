package com.cfa.zer0.mapper

import com.cfa.zer0.entity.Tag
import com.cfa.zer0.generated.model.ApiTag
import org.springframework.stereotype.Component

@Component
class TagMapper {
    private val characterPrefix = "character_"
    private val creatorPrefix = "creator_"
    private val genrePrefix = "genre_"
    private val formatPrefix = "format_"
    private val otherPrefix = "other_"

    fun toApiTag(tags: List<Tag>): ApiTag {
        val characters = mutableListOf<String>()
        val creators = mutableListOf<String>()
        val genres = mutableListOf<String>()
        val formats = mutableListOf<String>()
        val others = mutableListOf<String>()

        tags.forEach { tag ->
            val tagValue = tag.tag
            when {
                tagValue.startsWith(characterPrefix) ->
                    characters.add(tagValue.removePrefix(characterPrefix))

                tagValue.startsWith(creatorPrefix) ->
                    creators.add(tagValue.removePrefix(creatorPrefix))

                tagValue.startsWith(genrePrefix) ->
                    genres.add(tagValue.removePrefix(genrePrefix))

                tagValue.startsWith(formatPrefix) ->
                    formats.add(tagValue.removePrefix(formatPrefix))

                else -> others.add(tagValue.removePrefix(otherPrefix))
            }
        }

        return ApiTag(
            characters = characters,
            creators = creators,
            genres = genres,
            formats = formats,
            others = others
        )
    }

    fun toTag(apiTag: ApiTag): List<Tag> {
        val tags = mutableListOf<Tag>()
        apiTag.characters?.forEach { character ->
            tags.add(Tag(tag = characterPrefix + character))
        }
        apiTag.creators?.forEach { creator ->
            tags.add(Tag(tag = creatorPrefix + creator))
        }
        apiTag.genres?.forEach { genre ->
            tags.add(Tag(tag = genrePrefix + genre))
        }
        apiTag.formats?.forEach { format ->
            tags.add(Tag(tag = formatPrefix + format))
        }
        apiTag.others?.forEach { other ->
            tags.add(Tag(tag = otherPrefix + other))
        }
        return tags
    }
}