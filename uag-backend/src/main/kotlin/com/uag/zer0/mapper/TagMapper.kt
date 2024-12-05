package com.uag.zer0.mapper

import com.uag.zer0.entity.Tag
import com.uag.zer0.generated.model.ApiTag
import org.springframework.stereotype.Component

@Component
class TagMapper {
    private val characterList =
        listOf("零崎真白", "零崎くるみ", "零崎鈴")
    private val creatorsList = listOf("零崎")
    private val genresList = listOf("icon", "illustration")
    private val formatsList = listOf("CG")

    fun toApiTag(tags: List<Tag>): ApiTag {
        val characters = mutableListOf<String>()
        val creators = mutableListOf<String>()
        val genres = mutableListOf<String>()
        val formats = mutableListOf<String>()
        val others = mutableListOf<String>()

        tags.forEach { tag ->
            when (tag.tag) {
                in characterList -> characters.add(tag.tag)
                in creatorsList -> creators.add(tag.tag)
                in genresList -> genres.add(tag.tag)
                in formatsList -> formats.add(tag.tag)
                else -> others.add(tag.tag)
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
            tags.add(Tag(tag = character))
        }
        apiTag.creators?.forEach { creator ->
            tags.add(Tag(tag = creator))
        }
        apiTag.genres?.forEach { genre ->
            tags.add(Tag(tag = genre))
        }
        apiTag.formats?.forEach { format ->
            tags.add(Tag(tag = format))
        }
        apiTag.others?.forEach { other ->
            tags.add(Tag(tag = other))
        }
        return tags
    }
}