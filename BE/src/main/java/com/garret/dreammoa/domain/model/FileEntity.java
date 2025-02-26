package com.garret.dreammoa.domain.model;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_file",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"relatedId", "relatedType"})})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId; // 파일 ID (INT UNSIGNED)

    @Column(nullable = false)
    private Long relatedId; // 게시글, 유저, 챌린지의 ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private RelatedType relatedType; // 파일의 구분 (ENUM)

    @Column(nullable = false, length = 255)
    private String fileName; // 원본 파일 이름

    @Column(nullable = false, length = 500)
    private String filePath; // 파일 저장 경로

    @Column(nullable = false, length = 500)
    private String fileUrl; // 파일 URL (타입 변경: Long → String)

    @Column(nullable = false, length = 255)
    private String fileType; // 파일 MIME 타입

    private LocalDateTime createdAt; // 파일 업로드 일자

    @PrePersist
    public void prePersist() {
        this.createdAt = (this.createdAt == null) ? LocalDateTime.now() : this.createdAt;
    }

    @OneToOne
    @JoinColumn(name = "related_id", referencedColumnName = "id", insertable = false, updatable = false)
    private UserEntity user;

    public enum RelatedType {
        POST, PROFILE, CHALLENGE
    }
}

