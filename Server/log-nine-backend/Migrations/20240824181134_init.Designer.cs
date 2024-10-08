﻿// <auto-generated />
using System;
using LogNineBackend;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace LogNineBackend.Migrations
{
    [DbContext(typeof(AppContext))]
    [Migration("20240824181134_init")]
    partial class init
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.2");

            modelBuilder.Entity("LogNineBackend.Models.Board", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("VisualIdCounter")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Boards");
                });

            modelBuilder.Entity("LogNineBackend.Models.JobTask", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int?>("AssignedToId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("BoardId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("Priority")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Status")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("TargetId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TaskType")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<int>("VisualId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("AssignedToId");

                    b.HasIndex("BoardId");

                    b.HasIndex("TargetId");

                    b.ToTable("JobTasks");
                });

            modelBuilder.Entity("LogNineBackend.Models.Person", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("BoardId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("People");
                });

            modelBuilder.Entity("LogNineBackend.Models.Team", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("BoardId")
                        .HasColumnType("INTEGER");

                    b.Property<float>("LrFrequency")
                        .HasColumnType("REAL");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<float>("SrFrequency")
                        .HasColumnType("REAL");

                    b.HasKey("Id");

                    b.HasIndex("BoardId");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("LogNineBackend.Models.JobTask", b =>
                {
                    b.HasOne("LogNineBackend.Models.Person", "AssignedTo")
                        .WithMany()
                        .HasForeignKey("AssignedToId");

                    b.HasOne("LogNineBackend.Models.Board", "Board")
                        .WithMany("Tasks")
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("LogNineBackend.Models.Team", "Target")
                        .WithMany()
                        .HasForeignKey("TargetId");

                    b.Navigation("AssignedTo");

                    b.Navigation("Board");

                    b.Navigation("Target");
                });

            modelBuilder.Entity("LogNineBackend.Models.Team", b =>
                {
                    b.HasOne("LogNineBackend.Models.Board", "Board")
                        .WithMany("Teams")
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Board");
                });

            modelBuilder.Entity("LogNineBackend.Models.Board", b =>
                {
                    b.Navigation("Tasks");

                    b.Navigation("Teams");
                });
#pragma warning restore 612, 618
        }
    }
}
